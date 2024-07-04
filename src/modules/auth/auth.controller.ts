import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequestDto } from './models/dto/request/auth-request.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';
import {
  SignInResponseDto,
  SignUpResponseDto,
} from './models/dto/response/auth-response.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt-guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { IUserData } from './types/user-data.type';
import { TokenResponseDto } from './models/dto/response/token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration user' })
  @Post('sign-up')
  public async signUp(@Body() dto: AuthRequestDto): Promise<SignUpResponseDto> {
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login user' })
  @Post('sign-in')
  public async signIn(@Body() dto: AuthRequestDto): Promise<SignInResponseDto> {
    return await this.authService.signIn(dto);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(RefreshJwtGuard)
  @ApiOperation({ summary: 'Update tokens pair' })
  @Post('refresh')
  public async updateTokensPair(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenResponseDto> {
    return await this.authService.updateTokensPair(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }
}
