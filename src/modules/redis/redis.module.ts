import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { ConfigType, RedisConfig } from '../../configs/config.type';
import { REDIS_PROVIDER } from './redis.constants';
import { RedisService } from './redis.service';

const redisProvider = {
  provide: REDIS_PROVIDER,
  useFactory: (configService: ConfigService<ConfigType>): Redis => {
    const redisConfig = configService.get<RedisConfig>('redis');
    return new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [redisProvider, RedisService],
  exports: [redisProvider, RedisService],
})
export class RedisModule {}
