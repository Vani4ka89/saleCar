import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { ERole } from '../../common/enums/role.enum';
import { UpdateUserAccTypeRequestDto } from './models/dto/request/update-user-acc-type-request.dto';
import { UserResponseDto } from './models/dto/response/user-response.dto';
import { UpdateUserRoleRequestDto } from './models/dto/request/update-user-role-request.dto';
import { BanUserRequestDto } from './models/dto/request/ban-user.request.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/types/user-data.type';
import { UpdateUserRequestDto } from './models/dto/request/update-user.request.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change account-type (for admin only)' })
  @Post(':id/change-acc-type')
  @Roles(ERole.ADMIN, ERole.MANAGER)
  public async changeUserAccountType(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserAccTypeRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.changeUserAccountType(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change role (for admin only)' })
  @Post(':id/change-role')
  @Roles(ERole.ADMIN, ERole.MANAGER)
  public async changeUserRole(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserRoleRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.changeUserRole(dto, userId);
  }

  @ApiOperation({ summary: 'Ban user (can only admin and manager)' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @Post('ban')
  @Roles(ERole.ADMIN, ERole.MANAGER)
  public async banUser(
    @Body() dto: BanUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.banUser(dto);
  }

  @ApiOperation({ summary: 'Unban user (can only admin and manager)' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @Post('unban')
  @Roles(ERole.ADMIN, ERole.MANAGER)
  public async unbanUser(
    @Body() dto: BanUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.unbanUser(dto);
  }

  @ApiOperation({ summary: 'Get my profile' })
  @ApiBearerAuth()
  @Get('me')
  public async getMyProfile(
    @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.userService.getMyProfile(userData);
  }

  @ApiOperation({ summary: 'Update my profile' })
  @ApiBearerAuth()
  @Put('me')
  public async updateMyProfile(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMyProfile(userData, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete profile (admin option)' })
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(ERole.ADMIN)
  public async deleteProfile(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.userService.deleteProfile(userId);
  }
}
