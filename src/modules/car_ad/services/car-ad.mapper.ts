import { config } from 'dotenv';

import getConfig from '../../../configs/configuration';
import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import { ListCarAdRequestDto } from '../models/dto/request/list-car-ad.request.dto';
import {
  CarAdResponseDto,
  CarAdResponseManyDto,
  CarAdResponseWithUserDto,
} from '../models/dto/response/car-ad.response.dto';
import { EAccountType } from '../../auth/enums/account-type.enum';
import { UserMapper } from '../../user/services/user.mapper';

config({ path: '.env' });

const s3Config = getConfig().awsS3;

export class CarAdMapper {
  public static toResponseDto(
    entity: CarAdEntity,
    options?: {
      totalViews?: number;
      dailyViews?: number;
      weeklyViews?: number;
      monthlyViews?: number;
      averageRegionPrice?: number;
      averagePrice?: number;
      accType?: EAccountType;
    },
  ): CarAdResponseDto | CarAdResponseWithUserDto {
    const baseResponse = {
      id: entity.id,
      title: entity.title,
      description: entity.description ? entity.description : null,
      brand: entity.brand,
      model: entity.model,
      price: entity.price,
      year: entity.year,
      currency: entity.currency,
      priceUSD: Number(entity.priceUSD),
      priceEUR: Number(entity.priceEUR),
      priceUAH: Number(entity.priceUAH),
      exchangeRate: entity.exchangeRate,
      region: entity.region,
      isActive: entity.isActive,
      image: entity.image ? `${s3Config.AWS_S3_URL}${entity.image}` : null,
    };

    if (options?.accType) {
      return {
        ...baseResponse,
        user: UserMapper.toResponseDto(entity.user),
        totalViews: options.totalViews,
        dailyViews: options.dailyViews,
        weeklyViews: options.weeklyViews,
        monthlyViews: options.monthlyViews,
        averagePrice: options.averagePrice,
        averageRegionPrice: options.averageRegionPrice,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      } as CarAdResponseWithUserDto;
    } else {
      return baseResponse as CarAdResponseDto;
    }
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
