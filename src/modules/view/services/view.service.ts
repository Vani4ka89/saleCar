import { Injectable } from '@nestjs/common';
import { ViewRepository } from '../../repository/services/view.repository';
import { ViewEntity } from '../../../database/entities/view.entity';

@Injectable()
export class ViewService {
  constructor(private readonly viewRepository: ViewRepository) {}

  public async createCarAdView(
    user_id: string,
    carAd_id: string,
    value: number,
  ): Promise<ViewEntity> {
    return await this.viewRepository.save(
      this.viewRepository.create({ user_id, carAd_id, value }),
    );
  }

  public async findCarAdView(
    user_id: string,
    carAd_id: string,
  ): Promise<ViewEntity> {
    return await this.viewRepository.findOneBy({ user_id, carAd_id });
  }
}
