import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { decode, sign, verify } from 'jsonwebtoken';
import { appConfig } from '../../config';
import { UserEntity } from '../../database/entities';
import { UserService } from '../user/user.service';
import { JwtPayload, TokenPair } from './auth.types';
import { UserLoginDto, UserRegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    @Inject(UserEntity.name)
    private readonly userRepository: typeof UserEntity,
  ) {}

  async register(dto: UserRegisterDto) {
    const exists = await this.userService.getUserByEmail(dto.email);

    if (exists) {
      throw new ConflictException(`User already exists`);
    }

    dto.password = await hash(dto.password, 10);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    return user;
  }

  verify(token: string, type: 'access' | 'refresh'): boolean {
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

  decode(token: string): JwtPayload {
    const decoded = decode(token, { json: true });

    if (!decoded) {
      throw new UnauthorizedException();
    }

    return decoded as JwtPayload;
  }

  async login(dto: UserLoginDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException();
    }

    return this.makeTokenPair(user);
  }

  private makeTokenPair(user: UserEntity): TokenPair {
    const payload: JwtPayload = { id: user.id };

    const accessToken = sign(payload, appConfig.jwt.accessSecret, { expiresIn: '1h' });
    const refreshToken = sign(payload, appConfig.jwt.refreshSecret, { expiresIn: '1w' });

    return { accessToken, refreshToken };
  }
}
