import { PickType } from '@nestjs/swagger';
import { BaseUserRequestDto } from './base-user-request.dto';

export class UpdateUserRoleRequestDto extends PickType(BaseUserRequestDto, [
  'role',
]) {}
