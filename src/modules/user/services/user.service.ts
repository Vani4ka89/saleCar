import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../../repository/services/user.repository';
import { UserEntity } from '../../../database/entities/user.entity';
import { UpdateUserAccTypeRequestDto } from '../models/dto/request/update-user-acc-type-request.dto';
import { UserResponseDto } from '../models/dto/response/user-response.dto';
import { UserMapper } from './user.mapper';
import { UpdateUserRoleRequestDto } from '../models/dto/request/update-user-role-request.dto';
import { BanUserRequestDto } from '../models/dto/request/ban-user.request.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IUserData } from '../../auth/types/user-data.type';
import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';
import { UpdateUserRequestDto } from '../models/dto/request/update-user.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userRepository: UserRepository,
  ) {}

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

  public async getMyProfile(userData: IUserData): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const entity = await userRepository.findOneBy({ id: userData.userId });
      return UserMapper.toResponseDto(entity);
    });
  }

  public async updateMyProfile(
    useData: IUserData,
    dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const entity = await this.findByIdOrThrow(useData.userId);
      await userRepository.save(userRepository.merge(entity, dto));
      return UserMapper.toResponseDto(entity);
    });
  }

  public async deleteProfile(userId: string): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const refreshTokenRepository = em.getRepository(RefreshTokenEntity);
      const user = await this.findByIdOrThrow(userId);
      await Promise.all([
        refreshTokenRepository.delete(user.id),
        // this.authCacheService.removeToken(user.id),
        userRepository.remove(user),
      ]);
    });
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
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

  public async isUserExist(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
