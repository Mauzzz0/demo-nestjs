import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';
import { User } from '../../decorators';
import { AuthGuard } from '../../guards';
import { UserProfileDto } from './dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  @ApiOkResponse({ type: UserProfileDto })
  @ApiOperation({ summary: 'Получить пользователя из текущего Access токена' })
  @Get('/profile')
  async getProfile(@User() user: UserEntity) {
    const { password, ...rest } = user;

    return rest;
  }
}
