import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CarAdModule } from './car_ad/car_ad.module';
import { ViewModule } from './view/view.module';
import { EmailModule } from './email/email.module';
import configuration from '../configs/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PostgresModule,
    RedisModule,
    RepositoryModule,
    AuthModule,
    CarAdModule,
    UserModule,
    ViewModule,
    EmailModule,
  ],
})
export class AppModule {}
