import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigType, JwtConfig } from '../../../configs/config.type';
import { RedisService } from '../../redis/redis.service';
import { AUTH_CACHE } from '../constants/constants';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JwtConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<ConfigType>,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt');
  }

  public async saveToken(userId: string, accessToken: string): Promise<void> {
    const key = `${AUTH_CACHE.ACCESS_TOKEN}:${userId}`;

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, accessToken);
    await this.redisService.expire(key, this.jwtConfig.accessTokenExpire);
  }

  public async removeToken(userId: string): Promise<void> {
    await this.redisService.deleteByKey(`${AUTH_CACHE.ACCESS_TOKEN}:${userId}`);
  }

  public async isAccessTokenExist(
    userId: string,
    accessToken: string,
  ): Promise<boolean> {
    const userAccessTokens = await this.redisService.sMembers(
      `${AUTH_CACHE.ACCESS_TOKEN}:${userId}`,
    );
    return userAccessTokens.some((token: string) => token === accessToken);
  }
}
