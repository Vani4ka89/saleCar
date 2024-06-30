import { PickType } from '@nestjs/swagger';

import { BaseCarAdRequestDto } from './base-car-ad.request.dto';

export class CreateCarAdRequestDto extends PickType(BaseCarAdRequestDto, [
  'title',
  'description',
  'brand',
  'model',
  'price',
  'year',
  'currency',
  'region',
]) {}
