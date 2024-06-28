import { UserEntity } from '../../../database/entities/user.entity';
import { UserResponseDto } from '../models/dto/response/user-response.dto';

export class UserMapper {
  public static toResponseDto(entity: UserEntity): UserResponseDto {
    return {
      userId: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      accountType: entity.accountType,
      image: entity.image,
      banned: entity.banned,
      banReason: entity.banReason,
    };
  }
}
