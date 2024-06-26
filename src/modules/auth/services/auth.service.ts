import { Injectable } from '@nestjs/common';
import { AuthRequestDto } from '../models/dto/request/auth-request.dto';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { AccountTypeRepository } from '../../repository/services/account-type.repository';
import { RoleRepository } from '../../repository/services/role.repository';
import { ERole } from '../enums/role.enum';
import { EAccountType } from '../enums/account-type.enum';
import { UserRepository } from '../../repository/services/user.repository';
import { AuthMapper } from './auth.mapper';
import { AuthResponseDto } from '../models/dto/response/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountTypeRepository: AccountTypeRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  public async signUp(dto: AuthRequestDto): Promise<AuthResponseDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);
    const password = await bcrypt.hash(dto.password, 8);
    const role = await this.roleRepository.save(
      this.roleRepository.create({ name: ERole.SELLER }),
    );
    const accountType = await this.accountTypeRepository.save(
      this.accountTypeRepository.create({
        name: EAccountType.BASIC,
        description: 'aaa',
      }),
    );
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password, role, accountType }),
    );
    return AuthMapper.toResponseDto(user);
  }
}
