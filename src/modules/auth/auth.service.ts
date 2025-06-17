import { Injectable } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from './dto';

@Injectable()
export class AuthService {
  async register(dto: UserRegisterDto) {
    return { id: 1, ...dto };
  }

  async login(dto: UserLoginDto) {
    return dto;
  }
}
