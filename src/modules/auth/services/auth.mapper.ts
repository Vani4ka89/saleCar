import { UserEntity } from '../../../database/entities/user.entity';
import { AuthResponseDto } from '../models/dto/response/auth-response.dto';

export class AuthMapper {
  public static toResponseDto(entity: UserEntity): AuthResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      role: entity.role.name,
      accountType: entity.accountType.name,
    };
  }
}
