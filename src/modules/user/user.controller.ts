import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';
import { User } from '../../decorators';
import { AuthGuard } from '../../guards';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  @ApiOperation({ summary: 'Получить пользователя из текущего Access токена' })
  @Get('/profile')
  async getProfile(@User() user: UserEntity) {
    return user;
  }
}
