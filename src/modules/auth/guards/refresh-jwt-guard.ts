import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { ETokenType } from '../enums/token-type.enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException('Not token');
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      ETokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException('Token not valid');
    }

    const isExist =
      await this.refreshTokenRepository.isTokenExist(refreshToken);
    if (!isExist) {
      throw new UnauthorizedException('Token not valid');
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }
    request.user = {
      user,
    };
    return true;
  }
}
