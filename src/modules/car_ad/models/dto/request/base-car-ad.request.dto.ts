import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class BaseCarAdRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Honda' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Accord' })
  @IsString()
  model: string;

  @ApiProperty({ example: '12000' })
  @IsInt()
  price: number;

  @ApiProperty({ example: '2015' })
  @Min(1990)
  @Max(new Date().getFullYear())
  @IsInt()
  year: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  // @ApiProperty({ example: 'USD' })
  // @IsEnum(ECurrency)
  // @IsString()
  // currency: string;
}
