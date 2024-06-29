import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { S3Service } from './services/s3.service';
import { CarAdController } from './car_ad.controller';
import { CarAdService } from './services/car_ad.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [CarAdController],
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
    CarAdService,
    S3Service,
  ],
})
export class CarAdModule {}
