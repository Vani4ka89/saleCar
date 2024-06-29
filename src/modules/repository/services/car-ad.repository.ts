import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import { IUserData } from '../../auth/types/user-data.type';
import { ListCarAdRequestDto } from '../../car_ad/models/dto/request/list-car-ad.request.dto';
import { CarAdStatisticRequestDto } from '../../car_ad/models/dto/request/car-ad-statistic-request.dto';

@Injectable()
export class CarAdRepository extends Repository<CarAdEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarAdEntity, dataSource.manager);
  }

  public async getAllCarAds(
    query: ListCarAdRequestDto,
    em?: EntityManager,
  ): Promise<[CarAdEntity[], number]> {
    const carRepository = em.getRepository(CarAdEntity) ?? this;
    const qb = carRepository.createQueryBuilder('car');
    qb.take(query.limit);
    qb.skip(query.offset);
    qb.addOrderBy('car.createdAt');
    return await qb.getManyAndCount();
  }

  public async getAllMyCarAds(
    query: ListCarAdRequestDto,
    userData: IUserData,
    em?: EntityManager,
  ): Promise<[CarAdEntity[], number]> {
    const carRepository = em.getRepository(CarAdEntity) ?? this;
    const qb = carRepository.createQueryBuilder('car');
    qb.setParameter('myId', userData.userId);
    qb.where('car.user_id = :myId');
    qb.take(query.limit);
    qb.skip(query.offset);
    qb.addOrderBy('car.createdAt');
    return await qb.getManyAndCount();
  }

  public async getCarAdsStatistics(
    dto: CarAdStatisticRequestDto,
    em?: EntityManager,
  ): Promise<CarAdEntity[]> {
    const carRepository = em.getRepository(CarAdEntity) ?? this;
    const qb = carRepository.createQueryBuilder('car');
    qb.setParameter('brand', dto.brand);
    qb.setParameter('model', dto.model);
    qb.setParameter('year', dto.year);
    if (dto.brand) {
      qb.where('car.brand = :brand');
    }
    if (dto.model) {
      qb.where('car.model = :model');
    }
    if (dto.year) {
      qb.where('car.year = :year');
    }
    qb.addOrderBy('car.createdAt');
    return await qb.getMany();
  }
}
