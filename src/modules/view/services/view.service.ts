import { Injectable } from '@nestjs/common';
import { ViewRepository } from '../../repository/services/view.repository';
import { ViewEntity } from '../../../database/entities/view.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class ViewService {
  constructor(private readonly viewRepository: ViewRepository) {}

  public async createCarAdView(
    user_id: string,
    carAd_id: string,
    em?: EntityManager,
  ): Promise<ViewEntity> {
    const viewRepository = em.getRepository(ViewEntity) ?? this.viewRepository;
    return await viewRepository.save(
      viewRepository.create({ user_id, carAd_id, viewDate: new Date() }),
    );
  }

  public async findCarAdView(
    user_id: string,
    carAd_id: string,
    em?: EntityManager,
  ): Promise<ViewEntity> {
    const viewRepository = em.getRepository(ViewEntity) ?? this.viewRepository;
    return await viewRepository.findOneBy({ user_id, carAd_id });
  }

  public async countViews(
    carAd_id: string,
    em?: EntityManager,
  ): Promise<number> {
    const viewRepository = em.getRepository(ViewEntity) ?? this.viewRepository;
    return await viewRepository.count({ where: { carAd_id } });
  }
}
