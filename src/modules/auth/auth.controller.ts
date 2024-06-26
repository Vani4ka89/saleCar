import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequestDto } from './models/dto/request/auth-request.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { AuthResponseDto } from './models/dto/response/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  // @ApiOperation({ summary: 'Registration' })
  // @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('sign-up')
  public async signUp(@Body() dto: AuthRequestDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(dto);
  }
}
