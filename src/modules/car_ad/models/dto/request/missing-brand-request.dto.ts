import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MissingBrandDto {
  @ApiProperty({ description: 'Missing brand name' })
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @ApiProperty({ description: 'Information from seller', required: false })
  @IsString()
  additionalInfo?: string;
}
