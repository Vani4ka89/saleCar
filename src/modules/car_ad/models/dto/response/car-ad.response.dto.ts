import { UserResponseDto } from '../../../../user/models/dto/response/user-response.dto';

export class CarAdResponseWithOutUserDto {
  id: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  currency: string;

  exchangeRate: string;
  region: string;
  isActive: boolean;
  views: number;

  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CarAdResponseDto extends CarAdResponseWithOutUserDto {
  user: UserResponseDto;
}

export class CarAdResponseManyDto {
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
  carAds: CarAdResponseWithOutUserDto[];
}
