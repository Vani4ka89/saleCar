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

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async signUp(dto: AuthRequestDto): Promise<SignUpResponseDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);
    const password = await bcrypt.hash(dto.password, 8);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    return AuthMapper.toSignUpResponseDto(user);
  }

  public async signIn(dto: AuthRequestDto): Promise<SignInResponseDto> {
    const user = await this.userRepository.findOne({
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
      this.removeRefreshTokens(user.id),
      this.saveAuthTokens(user.id, tokens),
    ]);
    return AuthMapper.toSignInResponseDto(user, tokens);
  }

  public async updateTokensPair(
    userData: IUserData,
  ): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });
    const tokens = await this.tokenService.generateTokenPair({
      email: user.email,
      userId: user.id,
      role: user.role,
      accountType: user.accountType,
    });
    await Promise.all([
      this.removeRefreshTokens(user.id),
      this.saveAuthTokens(user.id, tokens),
    ]);
    return tokens;
  }

  public async logout(userData: IUserData): Promise<void> {
    await this.removeRefreshTokens(userData.userId);
  }

  private async saveAuthTokens(
    userId: string,
    tokens: ITokenPair,
  ): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.saveToken(userId, tokens.refreshToken),
      this.authCacheService.saveToken(userId, tokens.accessToken),
    ]);
  }

  public async removeRefreshTokens(userId: string): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        user_id: userId,
      }),
      this.authCacheService.removeToken(userId),
    ]);
  }
}
