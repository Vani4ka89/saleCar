import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListCarAdRequestDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty()
  @Min(0)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;
}
