import { PickType } from '@nestjs/swagger';
import { BaseUserRequestDto } from './base-user-request.dto';

export class UpdateUserAccTypeRequestDto extends PickType(BaseUserRequestDto, [
  'accountType',
]) {}
