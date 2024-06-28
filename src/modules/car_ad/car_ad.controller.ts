import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/types/user-data.type';
import { CreateCarAdRequestDto } from './models/dto/request/create-car-ad.request.dto';
import { ListCarAdRequestDto } from './models/dto/request/list-car-ad.request.dto';
import { UpdateCarAdRequestDto } from './models/dto/request/update-car-ad.request.dto';
import {
  CarAdResponseDto,
  CarAdResponseManyDto,
} from './models/dto/response/car-ad.response.dto';
import { validators } from './validators/upload-photo.validator';
import { ERole } from '../../common/enums/role.enum';
import { CarAdService } from './services/car_ad.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('CarAd')
@Controller('car-ads')
export class CarAdController {
  constructor(private readonly carAdService: CarAdService) {}

  @ApiBearerAuth()
  @Post()
  @Roles(ERole.ADMIN, ERole.SELLER)
  public async createCarAd(
    @Body() dto: CreateCarAdRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.createCarAd(dto, userData);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get all car advertisements' })
  @Get()
  public async getAllCarAds(
    @Query() query: ListCarAdRequestDto,
  ): Promise<CarAdResponseManyDto> {
    return await this.carAdService.getAllCarAds(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all my cars advertisements' })
  @Get('my')
  @Roles(ERole.ADMIN, ERole.SELLER)
  public async getAllMyCarAds(
    @Query() query: ListCarAdRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseManyDto> {
    return await this.carAdService.getAllMyCarAds(query, userData);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get public car advertisement' })
  @Get(':id')
  public async getCarAdById(
    @Param('id', ParseUUIDPipe) carAdId: string,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.getCarAdById(carAdId);
  }

  @ApiBearerAuth()
  @Put(':carAdId/photo')
  @Roles(ERole.ADMIN, ERole.SELLER)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadPhoto(
    @UploadedFile(validators) file: Express.Multer.File,
    @Param('carAdId', ParseUUIDPipe) carAdId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.uploadPhoto(file, carAdId, userData);
  }

  @ApiOperation({
    summary: 'Update my car advertisement (Only for admin, manager, seller)',
  })
  @ApiBearerAuth()
  @Put(':carAdId')
  @Roles(ERole.ADMIN, ERole.SELLER)
  public async editMyCarAd(
    @Param('carAdId', ParseUUIDPipe) carAdId: string,
    @Body() dto: UpdateCarAdRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.editMyCarAd(userData, carAdId, dto);
  }

  @ApiOperation({
    summary: 'Delete car advertisement (Only for admin, manager, seller)',
  })
  @ApiBearerAuth()
  @Delete(':carAdId')
  @Roles(ERole.ADMIN, ERole.SELLER)
  public async removeCarAdById(
    @Param('carAdId', ParseUUIDPipe) carAdId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.carAdService.removeCarAdById(carAdId, userData);
  }
}
