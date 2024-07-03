import { UserResponseDto } from '../../../../user/models/dto/response/user-response.dto';

export class CarAdResponseDto {
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
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CarAdResponseWithUserDto extends CarAdResponseDto {
  totalViews?: number;
  dailyViews?: number;
  weeklyViews?: number;
  monthlyViews?: number;
  averageRegionPrice?: number;
  user: UserResponseDto;
}

export class CarAdResponseManyDto {
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
  carAds: CarAdResponseDto[];
}
