import { config } from 'dotenv';

import getConfig from '../../../configs/configuration';
import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import { ListCarAdRequestDto } from '../models/dto/request/list-car-ad.request.dto';
import {
  CarAdResponseDto,
  CarAdResponseManyDto,
} from '../models/dto/response/car-ad.response.dto';
import { UserMapper } from '../../user/services/user.mapper';

config({ path: '.env' });

const s3Config = getConfig().awsS3;

export class CarAdMapper {
  public static toResponseDto(entity: CarAdEntity): CarAdResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      brand: entity.brand,
      model: entity.model,
      price: entity.price,
      year: entity.year,
      image: entity.image ? `${s3Config.AWS_S3_URL}${entity.image}` : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: entity.user ? UserMapper.toResponseDto(entity.user) : null,
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
