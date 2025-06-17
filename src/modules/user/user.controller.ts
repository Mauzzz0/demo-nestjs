// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
// import { User } from '../../decorators';
// import { AuthGuard } from '../../guards';
// import { UserService } from './user.service';
// import { UserDb } from './user.types';
//
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
// @Controller('user')
// export class UserController {
//   constructor(private readonly service: UserService) {}
//
//   @ApiOperation({ summary: 'Получить пользователя из текущего Access токена' })
//   @Get('/profile')
//   async getProfile(@User() user: UserDb) {
//     return user;
//   }
// }
