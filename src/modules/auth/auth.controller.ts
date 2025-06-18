import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../guards';
import { SuccessDto } from '../../shared';
import { UserProfileDto } from '../user/dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto, TokensDto, UserLoginDto, UserRegisterDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: UserProfileDto })
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @Post('register')
  async register(@Body() dto: UserRegisterDto) {
    return this.authService.register(dto);
  }

  @ApiCreatedResponse({ type: TokensDto })
  @ApiOperation({ summary: 'Вход для зарегистрированного пользователя' })
  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }

  @ApiCreatedResponse({ type: TokensDto })
  @ApiOperation({ summary: 'Обновление токенов' })
  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refresh(refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: SuccessDto })
  @ApiOperation({ summary: 'Выход для аутентифицированного пользователя' })
  @Post('logout')
  async logout(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.logout(refreshToken);
  }
}
