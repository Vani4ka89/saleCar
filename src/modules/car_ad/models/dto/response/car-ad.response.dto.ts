export class CarAdResponseDto {
  id: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CarAdResponseManyDto {
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
  carAds: CarAdResponseDto[];
}
