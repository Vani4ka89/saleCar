import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AccessJwtGuard } from './guards/access-jwt-guard';
import { TokenService } from './services/token.service';
import { AuthCacheService } from './services/auth-cache.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule, RedisModule, UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessJwtGuard,
    },
    AuthService,
    AuthCacheService,
    JwtService,
    TokenService,
  ],
  exports: [AuthService, TokenService, AuthCacheService, JwtService],
})
export class AuthModule {}
