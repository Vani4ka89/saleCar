import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ViewEntity } from '../../../database/entities/view.entity';

@Injectable()
export class ViewRepository extends Repository<ViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewEntity, dataSource.manager);
  }

  public async getDailyViews(
    carAdId: string,
    em?: EntityManager,
  ): Promise<number> {
    const viewRepository = em.getRepository(ViewEntity) ?? this;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await viewRepository
      .createQueryBuilder('view')
      .where('view.carAd_id = :carAdId', { carAdId })
      .andWhere('view.viewDate >= :today', { today })
      .getCount();
  }

  public async getWeeklyViews(
    carAdId: string,
    em?: EntityManager,
  ): Promise<number> {
    const viewRepository = em.getRepository(ViewEntity) ?? this;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    return await viewRepository
      .createQueryBuilder('view')
      .where('view.carAd_id = :carAdId', { carAdId })
      .andWhere('view.viewDate >= :oneWeekAgo', { oneWeekAgo })
      .getCount();
  }

  public async getMonthlyViews(
    carAdId: string,
    em?: EntityManager,
  ): Promise<number> {
    const viewRepository = em.getRepository(ViewEntity) ?? this;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);

    return await viewRepository
      .createQueryBuilder('view')
      .where('view.carAd_id = :carAdId', { carAdId })
      .andWhere('view.viewDate >= :oneMonthAgo', { oneMonthAgo })
      .getCount();
  }
}
