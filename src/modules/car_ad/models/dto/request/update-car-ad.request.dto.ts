import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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
}
