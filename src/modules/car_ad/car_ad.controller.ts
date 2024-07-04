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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
import { FileUploadDto } from './models/dto/request/file-upload.dto';
import { MissingBrandDto } from './models/dto/request/missing-brand-request.dto';

@ApiTags('CarAd')
@Controller('car-ads')
export class CarAdController {
  constructor(private readonly carAdService: CarAdService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create car-advertisement' })
  @Post()
  @Roles(ERole.SELLER)
  public async createCarAd(
    @Body() dto: CreateCarAdRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.createCarAd(dto, userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Notify administration about missing brand' })
  @Post('report-missing')
  @Roles(ERole.SELLER)
  public async reportMissingBrand(@Body() dto: MissingBrandDto): Promise<void> {
    await this.carAdService.sendMissingBrandMessage(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get all car-advertisements (public)' })
  @Get()
  public async getAllCarAds(
    @Query() query: ListCarAdRequestDto,
  ): Promise<CarAdResponseManyDto> {
    return await this.carAdService.getAllCarAds(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my car-advertisements' })
  @Get('my')
  @Roles(ERole.SELLER)
  public async getAllMyCarAds(
    @Query() query: ListCarAdRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseManyDto> {
    return await this.carAdService.getAllMyCarAds(query, userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one car-advertisement' })
  @Get(':id/info')
  public async getCarAdInfo(
    @Param('id', ParseUUIDPipe) carAdId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.getCarAdInfo(carAdId, userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my car-advertisement' })
  @Put(':id')
  @Roles(ERole.SELLER)
  public async editMyCarAd(
    @Param('id', ParseUUIDPipe) carAdId: string,
    @Body() dto: UpdateCarAdRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.editMyCarAd(userData, carAdId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car-advertisement (admin option)' })
  @Delete(':id')
  @Roles(ERole.ADMIN)
  public async removeCarAdById(
    @Param('id', ParseUUIDPipe) carAdId: string,
  ): Promise<void> {
    await this.carAdService.removeCarAdById(carAdId);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Add car-advertisement photo (admin option)' })
  @ApiBody({
    description: 'Upload photo',
    type: FileUploadDto,
  })
  @Put(':id/photo')
  @Roles(ERole.SELLER)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadPhoto(
    @UploadedFile(validators) file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) carAdId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.carAdService.uploadPhoto(file, carAdId, userData);
  }
}
