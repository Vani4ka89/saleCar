import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import { IUserData } from '../../auth/types/user-data.type';
import { ListCarAdRequestDto } from '../../car_ad/models/dto/request/list-car-ad.request.dto';

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
    carAd: CarAdEntity,
    em?: EntityManager,
  ): Promise<CarAdEntity[]> {
    const carRepository = em.getRepository(CarAdEntity) ?? this;
    const { brand, model, year } = carAd;
    const qb = carRepository.createQueryBuilder('car');
    qb.where('car.brand = :brand', { brand });
    qb.where('car.model = :model', { model });
    qb.where('car.year = :year', { year });
    return await qb.getMany();
  }

  public async getCarAdsRegionStatistics(
    carAd: CarAdEntity,
    em?: EntityManager,
  ): Promise<CarAdEntity[]> {
    const carRepository = em.getRepository(CarAdEntity) ?? this;
    const { brand, model, year, region } = carAd;
    const qb = carRepository.createQueryBuilder('car');
    qb.where('car.brand = :brand', { brand });
    qb.where('car.model = :model', { model });
    qb.where('car.year = :year', { year });
    qb.where('car.region = :region', { region });
    return await qb.getMany();
  }
}
