import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRequestDto } from '../models/dto/request/auth-request.dto';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repository/services/user.repository';
import { AuthMapper } from './auth.mapper';
import {
  SignInResponseDto,
  SignUpResponseDto,
} from '../models/dto/response/auth-response.dto';
import { TokenService } from './token.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { AuthCacheService } from './auth-cache.service';
import { ITokenPair } from '../types/token.type';
import { IUserData } from '../types/user-data.type';
import { TokenResponseDto } from '../models/dto/response/token-response.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';
import { ConfigType, JwtConfig } from '../../../configs/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly configService: ConfigService<ConfigType>,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt');
  }

  public async signUp(dto: AuthRequestDto): Promise<SignUpResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository =
        em.getRepository(UserEntity) ?? this.userRepository;
      await this.userService.isEmailUniqueOrThrow(dto.email, em);
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

  public async signIn(dto: AuthRequestDto): Promise<SignInResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository =
        em.getRepository(UserEntity) ?? this.userRepository;
      const user = await userRepository.findOne({
        where: { email: dto.email },
        select: {
          id: true,
          password: true,
          email: true,
          role: true,
          accountType: true,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Email or password are incorrect');
      }
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Email or password are incorrect');
      }
      const tokens = await this.tokenService.generateTokenPair({
        email: user.email,
        userId: user.id,
        role: user.role,
        accountType: user.accountType,
      });
      await Promise.all([
        this.removeRefreshTokens(user.id, em),
        this.saveAuthTokens(user.id, tokens, em),
      ]);
      return AuthMapper.toSignInResponseDto(user, tokens);
    });
  }

  public async updateTokensPair(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository =
        em.getRepository(UserEntity) ?? this.userRepository;
      const user = await userRepository.findOneBy({
        id: userData.userId,
      });
      const tokens = await this.tokenService.generateTokenPair({
        email: user.email,
        userId: user.id,
        role: user.role,
        accountType: user.accountType,
      });
      await Promise.all([
        this.removeRefreshTokens(user.id, em),
        this.saveAuthTokens(user.id, tokens, em),
      ]);
      return tokens;
    });
  }

  public async logout(userData: IUserData): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      await this.removeRefreshTokens(userData.userId, em);
    });
  }

  private async saveAuthTokens(
    userId: string,
    tokens: ITokenPair,
    em?: EntityManager,
  ): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.saveToken(userId, tokens.refreshToken, em),
      this.authCacheService.saveToken(userId, tokens.accessToken),
    ]);
  }

  public async removeRefreshTokens(
    userId: string,
    em?: EntityManager,
  ): Promise<void> {
    const refreshTokenRepository =
      em.getRepository(RefreshTokenEntity) ?? this.refreshTokenRepository;
    await Promise.all([
      refreshTokenRepository.delete({
        user_id: userId,
      }),
      this.authCacheService.removeToken(userId),
    ]);
  }
}
