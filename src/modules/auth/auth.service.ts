import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserEntity } from '../../database/entities';
import { UserService } from '../user/user.service';
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

  async login(dto: UserLoginDto) {
    return dto;
  }
}
