import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../../repository/services/user.repository';
import { UserEntity } from '../../../database/entities/user.entity';
import { UpdateUserAccTypeRequestDto } from '../models/dto/request/update-user-acc-type-request.dto';
import {
  UserResponseAllDto,
  UserResponseDto,
} from '../models/dto/response/user-response.dto';
import { UserMapper } from './user.mapper';
import { UpdateUserRoleRequestDto } from '../models/dto/request/update-user-role-request.dto';
import { BanUserRequestDto } from '../models/dto/request/ban-user.request.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IUserData } from '../../auth/types/user-data.type';
import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';
import { UpdateUserRequestDto } from '../models/dto/request/update-user.request.dto';
import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import { CarAdRepository } from '../../repository/services/car-ad.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { ViewEntity } from '../../../database/entities/view.entity';
import { ViewRepository } from '../../repository/services/view.repository';
import { SignUpResponseDto } from '../../auth/models/dto/response/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { AuthMapper } from '../../auth/services/auth.mapper';
import { ConfigType, JwtConfig } from '../../../configs/config.type';
import { ConfigService } from '@nestjs/config';
import { CreateAdminRequestDto } from '../models/dto/request/create-admin-request.dto';

@Injectable()
export class UserService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly carAdRepository: CarAdRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly viewRepository: ViewRepository,
    private readonly configService: ConfigService<ConfigType>,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt');
  }

  public async changeUserAccountType(
    dto: UpdateUserAccTypeRequestDto,
    userId: string,
  ): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository =
        em.getRepository(UserEntity) ?? this.userRepository;
      const user = await this.findByIdOrThrow(userId, em);
      if (user.accountType === dto.accountType) {
        throw new ConflictException(
          `User already has ${dto.accountType} account`,
        );
      }
      user.accountType = dto.accountType;
      const userEntity = await userRepository.save(user);
      return UserMapper.toResponseDto(userEntity);
    });
  }

  public async changeUserRole(
    dto: UpdateUserRoleRequestDto,
    userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.findByIdOrThrow(userId);
    if (user.role === dto.role) {
      throw new ConflictException(`User already has role ${dto.role}`);
    }
    user.role = dto.role;
    const userEntity = await this.userRepository.save(user);
    return UserMapper.toResponseDto(userEntity);
  }

  public async banUser(dto: BanUserRequestDto): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const user = await userRepository.findOneBy({ id: dto.userId });
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }
      if (user.banned === true) {
        throw new ConflictException('User has already banned');
      }
      user.banned = true;
      user.banReason = dto.banReason;
      const updatedUser = await userRepository.save(user);
      return UserMapper.toResponseDto(updatedUser);
    });
  }

  public async unbanUser(dto: BanUserRequestDto): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const user = await userRepository.findOneBy({ id: dto.userId });
      if (!user) {
        throw new UnprocessableEntityException('User not found');
      }
      if (user.banned === false) {
        throw new ConflictException('User not banned');
      }
      user.banned = false;
      user.banReason = dto.banReason;
      const updatedUser = await userRepository.save(user);
      return UserMapper.toResponseDto(updatedUser);
    });
  }

  public async getAllUsers(): Promise<UserResponseAllDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository =
        em.getRepository(UserEntity) ?? this.userRepository;
      const users = await userRepository.find();
      return UserMapper.toResponseAllDto(users);
    });
  }

  public async getMyProfile(userData: IUserData): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const entity = await this.findByIdOrThrow(userData.userId, em);
      return UserMapper.toResponseDto(entity);
    });
  }

  public async updateMyProfile(
    useData: IUserData,
    dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const entity = await this.findByIdOrThrow(useData.userId, em);
      await userRepository.save(userRepository.merge(entity, dto));
      return UserMapper.toResponseDto(entity);
    });
  }

  public async deleteProfile(userId: string): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository =
        em.getRepository(UserEntity) ?? this.userRepository;
      const refreshTokenRepository =
        em.getRepository(RefreshTokenEntity) ?? this.refreshTokenRepository;
      const carAdRepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const viewRepository =
        em.getRepository(ViewEntity) ?? this.viewRepository;
      const user = await this.findByIdOrThrow(userId, em);
      await Promise.all([
        refreshTokenRepository.delete({ user_id: user.id }),
        carAdRepository.delete({ user_id: user.id }),
        viewRepository.delete({ user_id: user.id }),
        userRepository.remove(user),
      ]);
    });
  }

  public async isEmailUniqueOrThrow(
    email: string,
    em?: EntityManager,
  ): Promise<void> {
    const userRepository = em.getRepository(UserEntity) ?? this.userRepository;
    const user = await userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User already exists');
    }
  }

  public async findByIdOrThrow(
    userId: string,
    em?: EntityManager,
  ): Promise<UserEntity> {
    const userRepository = em.getRepository(UserEntity) ?? this.userRepository;
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    return user;
  }

  public async createAdmin(
    dto: CreateAdminRequestDto,
  ): Promise<SignUpResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository =
        em.getRepository(UserEntity) ?? this.userRepository;
      await this.isEmailUniqueOrThrow(dto.email, em);
      const password = await bcrypt.hash(
        dto.password,
        this.jwtConfig.secretSalt,
      );

      const user = await userRepository.save(
        userRepository.create({ ...dto, password }),
      );

      return AuthMapper.toSignUpResponseDto(user);
    });
  }

  public async isAdminExist(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }
}
