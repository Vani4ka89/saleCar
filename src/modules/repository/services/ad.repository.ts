import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdEntity } from '../../../database/entities/ad.entity';

@Injectable()
export class AdRepository extends Repository<AdEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdEntity, dataSource.manager);
  }
}
