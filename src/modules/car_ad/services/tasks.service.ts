import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CarAdService } from './car_ad.service';

@Injectable()
export class TasksService {
  constructor(private readonly carAdService: CarAdService) {}

  @Cron('0 4 * * *')
  public async handleCron() {
    await this.carAdService.updateExchangeRates();
  }
}
