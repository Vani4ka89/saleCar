import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { S3Service } from './services/s3.service';
import { CarAdController } from './car_ad.controller';
import { CarAdService } from './services/car_ad.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ExchangeRateService } from './services/exchange-rate.service';
import { HttpModule } from '@nestjs/axios';
import { ViewModule } from '../view/view.module';
import { EmailModule } from '../email/email.module';
import { ForbiddenWordsService } from './services/forbidden-words.service';

@Module({
  imports: [AuthModule, EmailModule, HttpModule, UserModule, ViewModule],
  controllers: [CarAdController],
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
    CarAdService,
    ExchangeRateService,
    ForbiddenWordsService,
    S3Service,
  ],
})
export class CarAdModule {}
