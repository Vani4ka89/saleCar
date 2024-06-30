import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ECurrency } from '../../../enums/currency.enum';

export class UpdateCarAdRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  price?: number;

  @ApiProperty()
  @IsOptional()
  @Min(1990)
  @Max(new Date().getFullYear())
  @IsInt()
  year?: number;

  @ApiProperty({ example: 'USD' })
  @IsOptional()
  @IsEnum(ECurrency)
  @IsString()
  currency?: ECurrency;

  @ApiProperty({ example: "Ternopil'ska obl." })
  @IsOptional()
  @IsString()
  region?: string;
}
