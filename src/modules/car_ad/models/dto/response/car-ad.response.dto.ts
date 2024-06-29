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
  image: string;
  createdAt: Date;
  updatedAt: Date;
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
