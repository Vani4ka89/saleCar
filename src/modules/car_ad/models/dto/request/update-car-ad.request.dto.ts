import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ECurrency } from '../../../enums/currency.enum';

export class UpdateCarAdRequestDto {
  @ApiProperty({ example: 'Sale my car' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Very nice car' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'honda' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'accord' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 7500 })
  @IsOptional()
  @IsInt()
  price?: number;

  @ApiProperty({ example: 2007 })
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

  @ApiProperty({ example: 'Тернопільська обл.' })
  @IsOptional()
  @IsString()
  region?: string;
}
