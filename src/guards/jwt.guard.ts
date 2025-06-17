import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorizedFastifyRequest } from '../app.types';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (context.getType() !== 'http') {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthorizedFastifyRequest>();

    const header = request.headers['authorization'];
    if (!header) {
      throw new UnauthorizedException();
    }

    const [, accessToken] = header.split(' ');
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const valid = this.authService.verify(accessToken, 'access');
    if (!valid) {
      throw new UnauthorizedException();
    }

    const payload = this.authService.decode(accessToken);
    if (!payload) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }
}
