import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccountTypeRepository } from '../../repository/services/account-type.repository';
import { RoleRepository } from '../../repository/services/role.repository';
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
    private roleRepository: RoleRepository,
    private accountTypeRepository: AccountTypeRepository,
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
    const role = await this.roleRepository.findOneBy({ id: user.role_id });
    const accountType = await this.accountTypeRepository.findOneBy({
      id: user.accountType_id,
    });

    request.user = {
      userId: user.id,
      email: user.email,
      role: role.name,
      accountType: accountType.name,
    };
    return true;
  }
}
