import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CurrencyEntity } from '../../../database/entities/currency.entity';

@Injectable()
export class CurrencyRepository extends Repository<CurrencyEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CurrencyEntity, dataSource.manager);
  }
}
