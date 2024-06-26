import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ConfigType, JwtConfig } from '../../../configs/config.type';
import { ETokenType } from '../enums/token-type.enum';
import { IJwtPayload } from '../types/jwt-payload.type';
import { ITokenPair } from '../types/token.type';

@Injectable()
export class TokenService {
  private jwtConfig: JwtConfig;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<ConfigType>,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt');
  }

  public async generateTokenPair(payload: IJwtPayload): Promise<ITokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, ETokenType.ACCESS),
      this.generateToken(payload, ETokenType.REFRESH),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  public async verifyToken(
    token: string,
    type: ETokenType,
  ): Promise<IJwtPayload> {
    try {
      const secret = this.getSecret(type);
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (e) {
      throw new UnauthorizedException('Token not valid');
    }
  }

  private async generateToken(
    payload: IJwtPayload,
    type: ETokenType,
  ): Promise<string> {
    const secret = this.getSecret(type);
    const expiresIn = this.getExpiresIn(type);
    return await this.jwtService.signAsync(payload, { expiresIn, secret });
  }

  private getSecret(type: ETokenType): string {
    switch (type) {
      case ETokenType.ACCESS:
        return this.jwtConfig.accessTokenSecret;
      case ETokenType.REFRESH:
        return this.jwtConfig.refreshTokenSecret;
    }
  }

  private getExpiresIn(type: ETokenType): number {
    switch (type) {
      case ETokenType.ACCESS:
        return this.jwtConfig.accessTokenExpire;
      case ETokenType.REFRESH:
        return this.jwtConfig.refreshTokenExpire;
    }
  }
}
