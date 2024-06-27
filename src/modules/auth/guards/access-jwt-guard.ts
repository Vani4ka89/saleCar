import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRepository } from '../../repository/services/user.repository';
import { SKIP_AUTH } from '../constants/constants';
import { ETokenType } from '../enums/token-type.enum';
import { AuthCacheService } from '../services/auth-cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AccessJwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private authCacheService: AuthCacheService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('No token');
    }
    const payload = await this.tokenService.verifyToken(
      accessToken,
      ETokenType.ACCESS,
    );
    if (!payload) {
      throw new UnauthorizedException('Token not valid');
    }

    const findTokenInRedis = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      accessToken,
    );
    if (!findTokenInRedis) {
      throw new UnauthorizedException('Token not valid');
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    request.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      accountType: user.accountType,
    };
    return true;
  }
}
