import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { decode, sign, verify } from 'jsonwebtoken';
import { CacheTime } from '../../cache/cache.constants';
import { cacheRefreshToken } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import { appConfig } from '../../config';
import { UserEntity } from '../../database/entities';
import { UserService } from '../user/user.service';
import { JwtPayload, TokenPair } from './auth.types';
import { UserLoginDto, UserRegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,

    @Inject(UserEntity.name)
    private readonly userRepository: typeof UserEntity,
  ) {}

  async register(dto: UserRegisterDto) {
    const exists = await this.userService.getByEmail(dto.email);

    if (exists) {
      throw new ConflictException(`User already exists`);
    }

    dto.password = await hash(dto.password, 10);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const { password, ...rest } = user;

    return rest;
  }

  public verify(token: string, type: 'access' | 'refresh'): boolean {
    const secrets = {
      access: appConfig.jwt.accessSecret,
      refresh: appConfig.jwt.refreshSecret,
    };

    try {
      verify(token, secrets[type]);
      return true;
    } catch (err) {
      return false;
    }
  }

  public decode(token: string): JwtPayload {
    const decoded = decode(token, { json: true });

    if (!decoded) {
      throw new UnauthorizedException();
    }

    return decoded as JwtPayload;
  }

  async login(dto: UserLoginDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException();
    }

    return this.upsertTokenPair(user);
  }

  async refresh(refreshToken: string) {
    const valid = this.verify(refreshToken, 'refresh');
    if (!valid) {
      throw new UnauthorizedException();
    }

    const token = await this.cacheService.get<JwtPayload>(cacheRefreshToken(refreshToken));
    if (!token) {
      throw new UnauthorizedException();
    }
    await this.cacheService.delete(cacheRefreshToken(refreshToken));

    const user = await this.userService.getById(token.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.upsertTokenPair(user);
  }

  async logout(refreshToken: string) {
    await this.cacheService.delete(cacheRefreshToken(refreshToken));

    return { success: true };
  }

  private async upsertTokenPair(user: UserEntity): Promise<TokenPair> {
    const payload: JwtPayload = { id: user.id };

    const accessToken = sign(payload, appConfig.jwt.accessSecret, { expiresIn: '1h' });
    const refreshToken = sign(payload, appConfig.jwt.refreshSecret, { expiresIn: '1w' });

    await this.cacheService.set(
      cacheRefreshToken(refreshToken),
      { id: user.id },
      { expiration: { type: 'EX', value: CacheTime.day8 } },
    );

    return { accessToken, refreshToken };
  }
}
