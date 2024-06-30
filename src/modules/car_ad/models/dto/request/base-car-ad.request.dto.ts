import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ECurrency } from '../../../enums/currency.enum';

export class BaseCarAdRequestDto {
  @ApiProperty({ example: 'Sale my car' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Very nice car' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'honda' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'accord' })
  @IsString()
  model: string;

  @ApiProperty({ example: 7500 })
  @IsInt()
  price: number;

  @ApiProperty({ example: 2007 })
  @Min(1990)
  @Max(new Date().getFullYear())
  @IsInt()
  year: number;

  @ApiProperty({ example: 'USD' })
  @IsEnum(ECurrency)
  @IsString()
  currency: ECurrency;

  @ApiProperty({ example: "Ternopil'ska obl." })
  @IsString()
  region: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  views?: number;
}
