import { UserEntity } from '../../../database/entities/user.entity';
import { ITokenPair } from '../types/token.type';
import {
  SignInResponseDto,
  SignUpResponseDto,
} from '../models/dto/response/auth-response.dto';

export class AuthMapper {
  public static toSignUpResponseDto(entity: UserEntity): SignUpResponseDto {
    return {
      userId: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      accountType: entity.accountType,
      image: entity.image,
    };
  }

  public static toSignInResponseDto(
    entity: UserEntity,
    tokens: ITokenPair,
  ): SignInResponseDto {
    return {
      userId: entity.id,
      tokens,
    };
  }
}
