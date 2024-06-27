import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class BaseUserRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 20)
  name?: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  @Length(5, 30)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  @Transform(TransformHelper.trim)
  email: string;

  @ApiProperty({ example: 'P@$word1' })
  @IsString()
  @Length(8, 30)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  @Transform(TransformHelper.trim)
  password: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  accountType: string;
}
