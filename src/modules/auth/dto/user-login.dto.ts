import { PickType } from '@nestjs/swagger';
import { UserRegisterDto } from './user-register.dto';

export class UserLoginDto extends PickType(UserRegisterDto, ['email', 'password']) {}
