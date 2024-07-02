import { UserResponseDto } from '../../../../user/models/dto/response/user-response.dto';
import { ECurrency } from '../../../enums/currency.enum';

export class CarAdResponseWithOutUserDto {
  id: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  currency: string;

  priceUSD: number;
  priceEUR: number;
  priceUAH: number;

  exchangeRate: string;
  region: string;
  isActive: boolean;
  totalViews?: number;
  dailyViews?: number;
  weeklyViews?: number;
  monthlyViews?: number;
  averagePrice?: number;

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
