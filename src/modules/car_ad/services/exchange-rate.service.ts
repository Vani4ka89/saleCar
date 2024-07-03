import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IExchangeRate } from '../types/exchange-rate.type';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../constants/urls';
import { EntityManager } from 'typeorm';

@Injectable()
export class ExchangeRateService {
  constructor(private readonly httpService: HttpService) {}

  public async getExchangeRates(em?: EntityManager): Promise<IExchangeRate[]> {
    try {
      return await em.transaction(async () => {
        const { data } = await firstValueFrom(this.httpService.get(apiUrl));
        return data;
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'API privatbank error (no connection to server)',
      );
    }
  }

  public async getRatesMap(
    em?: EntityManager,
  ): Promise<{ [key: string]: number }> {
    return await em.transaction(async (em: EntityManager) => {
      const rates = await this.getExchangeRates(em);
      const ratesMap: { [key: string]: number } = {};

      rates.forEach((rate) => {
        ratesMap[rate.ccy] = parseFloat(rate.sale);
      });
      return ratesMap;
    });
  }
}
