import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../repository/services/user.repository';
import { UserEntity } from '../../../database/entities/user.entity';
import { AuthRequestDto } from '../../auth/models/dto/request/auth-request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // public async createUser(
  //   dto: AuthRequestDto,
  //   password: string,
  //   role: string,
  //   accountType: string,
  // ) {
  //   await this.userRepository.save(
  //     this.userRepository.create({ ...dto, password, role, accountType }),
  //   );
  // }

  public async isEmailUniqueOrThrow(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User already exist');
    }
    return user;
  }
}
