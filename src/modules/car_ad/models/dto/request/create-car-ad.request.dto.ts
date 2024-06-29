import { PickType } from '@nestjs/swagger';

import { BaseCarAdRequestDto } from './base-car-ad.request.dto';

export class CreateCarAdRequestDto extends PickType(BaseCarAdRequestDto, [
  'title',
  'brand',
  'model',
  'price',
  'year',
  'currency',
]) {}
