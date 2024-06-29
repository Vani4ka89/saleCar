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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { ERole } from '../../common/enums/role.enum';
import { UpdateUserAccTypeRequestDto } from './models/dto/request/update-user-acc-type-request.dto';
import {
  UserResponseAllDto,
  UserResponseDto,
} from './models/dto/response/user-response.dto';
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
  @ApiOperation({ summary: 'Change account-type (admin option)' })
  @Post(':id/change-acc-type')
  @Roles(ERole.ADMIN)
  public async changeUserAccountType(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserAccTypeRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.changeUserAccountType(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change role (admin option)' })
  @Post(':id/change-role')
  @Roles(ERole.ADMIN)
  public async changeUserRole(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserRoleRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.changeUserRole(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ban user (manager option)' })
  @Post('ban')
  @Roles(ERole.MANAGER)
  public async banUser(
    @Body() dto: BanUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.banUser(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unban user (manager option)' })
  @Post('unban')
  @Roles(ERole.MANAGER)
  public async unbanUser(
    @Body() dto: BanUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.unbanUser(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (manager option)' })
  @Get()
  @Roles(ERole.MANAGER)
  public async getAllUsers(): Promise<UserResponseAllDto> {
    return await this.userService.getAllUsers();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my profile' })
  @Get('me')
  public async getMyProfile(
    @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.userService.getMyProfile(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my profile' })
  @Put('me')
  public async updateMyProfile(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMyProfile(userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete profile (admin option)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(ERole.ADMIN)
  public async deleteProfile(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.userService.deleteProfile(userId);
  }
}
