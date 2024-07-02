import { config } from 'dotenv';

import getConfig from '../../../configs/configuration';
import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import { ListCarAdRequestDto } from '../models/dto/request/list-car-ad.request.dto';
import {
  CarAdResponseDto,
  CarAdResponseManyDto,
  CarAdResponseWithOutUserDto,
} from '../models/dto/response/car-ad.response.dto';
import { UserMapper } from '../../user/services/user.mapper';

config({ path: '.env' });

const s3Config = getConfig().awsS3;

export class CarAdMapper {
  public static toResponseWithOutUserDto(
    entity: CarAdEntity,
  ): CarAdResponseWithOutUserDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description ? entity.description : null,
      brand: entity.brand,
      model: entity.model,
      price: entity.price,
      year: entity.year,
      currency: entity.currency,

      priceUSD: entity.priceUSD,
      priceEUR: entity.priceEUR,
      priceUAH: entity.priceUAH,

      exchangeRate: entity.exchangeRate,
      region: entity.region,
      isActive: entity.isActive,

      image: entity.image ? `${s3Config.AWS_S3_URL}${entity.image}` : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static toResponseDto(
    entity: CarAdEntity,
    views?: number,
    averagePrice?: number,
  ): CarAdResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description ? entity.description : null,
      brand: entity.brand,
      model: entity.model,
      price: entity.price,
      year: entity.year,
      currency: entity.currency,

      priceUSD: entity.priceUSD,
      priceEUR: entity.priceEUR,
      priceUAH: entity.priceUAH,

      exchangeRate: entity.exchangeRate,
      region: entity.region,
      isActive: entity.isActive,
      views: views ? views : 0,
      averagePrice: averagePrice ? averagePrice : 0,

      image: entity.image ? `${s3Config.AWS_S3_URL}${entity.image}` : null,
      user: entity.user ? UserMapper.toResponseDto(entity.user) : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static toResponseManyDto(
    entities: CarAdEntity[],
    total?: number,
    query?: ListCarAdRequestDto,
  ): CarAdResponseManyDto {
    return {
      meta: {
        limit: query.limit,
        offset: query.offset,
        total,
      },
      carAds: entities.map((carAd) => this.toResponseDto(carAd)),
    };
  }
}
