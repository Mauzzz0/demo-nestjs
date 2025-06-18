import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../guards';
import { AuthService } from './auth.service';
import { RefreshTokenDto, UserLoginDto, UserRegisterDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async register(@Body() dto: UserRegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход для зарегистрированного пользователя' })
  async login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refresh(refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход для аутентифицированного пользователя' })
  async logout(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.logout(refreshToken);
  }
}
