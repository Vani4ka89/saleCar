import { PickType } from '@nestjs/swagger';
import { UpdateCarAdRequestDto } from './update-car-ad.request.dto';

export class CarAdStatisticRequestDto extends PickType(UpdateCarAdRequestDto, [
  'brand',
  'model',
  'year',
]) {}
