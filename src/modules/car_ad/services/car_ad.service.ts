import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import { IUserData } from '../../auth/types/user-data.type';
import { UserService } from '../../user/services/user.service';
import { EFileType } from '../enums/file-type.enum';
import { CreateCarAdRequestDto } from '../models/dto/request/create-car-ad.request.dto';
import { ListCarAdRequestDto } from '../models/dto/request/list-car-ad.request.dto';
import { UpdateCarAdRequestDto } from '../models/dto/request/update-car-ad.request.dto';
import {
  CarAdResponseDto,
  CarAdResponseManyDto,
} from '../models/dto/response/car-ad.response.dto';
import { CarAdMapper } from './car-ad.mapper';
import { S3Service } from './s3.service';
import { EAccountType } from '../../auth/enums/account-type.enum';
import { CarAdRepository } from '../../repository/services/car-ad.repository';

@Injectable()
export class CarAdService {
  constructor(
    private readonly carAdRepository: CarAdRepository,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async createCarAd(
    dto: CreateCarAdRequestDto,
    userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository = em.getRepository(CarAdEntity);
      const user = await this.userService.findByIdOrThrow(userData.userId);
      if (userData.accountType === EAccountType.BASIC) {
        const userCars = await carAdRepository.count({
          where: { user_id: user.id },
        });
        if (userCars >= 1) {
          throw new ForbiddenException(
            'Subscribe Premium account to add more cars!',
          );
        }
      }
      const car = await carAdRepository.save(
        carAdRepository.create({
          ...dto,
          user_id: user.id,
        }),
      );
      return CarAdMapper.toResponseDto(car);
    });
  }

  public async getAllCarAds(
    query: ListCarAdRequestDto,
  ): Promise<CarAdResponseManyDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const [carAds, total] = await this.carAdRepository.getAllCarAds(
        query,
        em,
      );
      return CarAdMapper.toResponseManyDto(carAds, total, query);
    });
  }

  public async getAllMyCarAds(
    query: ListCarAdRequestDto,
    userData: IUserData,
  ): Promise<CarAdResponseManyDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const [carAds, total] = await this.carAdRepository.getAllMyCarAds(
        query,
        userData,
        em,
      );
      return CarAdMapper.toResponseManyDto(carAds, total, query);
    });
  }

  public async getCarAdById(carId: string): Promise<CarAdResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carRepository = em.getRepository(CarAdEntity);
      const car = await carRepository.findOneBy({ id: carId });
      if (!car) {
        throw new UnprocessableEntityException('CarAd not found');
      }
      return CarAdMapper.toResponseDto(car);
    });
  }

  public async uploadPhoto(
    photo: Express.Multer.File,
    carAdId: string,
    userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carRepository = em.getRepository(CarAdEntity);
      const carAd = await carRepository.findOneBy({
        user_id: userData.userId,
        id: carAdId,
      });
      if (carAd.image) {
        await this.s3Service.deleteFile(carAd.image);
      }
      const filePath = await this.s3Service.uploadFile(
        photo,
        EFileType.CAR_PHOTO,
        carAd.id,
      );
      const car = await carRepository.save(
        carRepository.merge(carAd, {
          image: filePath,
          user_id: userData.userId,
        }),
      );
      return CarAdMapper.toResponseDto(car);
    });
  }

  public async editMyCarAd(
    userData: IUserData,
    carAdId: string,
    dto: UpdateCarAdRequestDto,
  ): Promise<CarAdResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository = em.getRepository(CarAdEntity);
      const carAd = await carAdRepository.findOneBy({
        id: carAdId,
        user_id: userData.userId,
      });
      if (!carAd) {
        throw new NotFoundException('Car advertisement not found');
      }
      const editedCarAd = await carAdRepository.save(
        carAdRepository.merge(carAd, dto),
      );
      return CarAdMapper.toResponseDto(editedCarAd);
    });
  }

  public async removeCarAdById(
    carAdId: string,
    userData: IUserData,
  ): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository = em.getRepository(CarAdEntity);
      const carAd = await carAdRepository.findOneBy({
        id: carAdId,
        user_id: userData.userId,
      });
      if (!carAd) {
        throw new UnprocessableEntityException('Car advertisement not found');
      }
      if (carAd.image) {
        await this.s3Service.deleteFile(carAd.image);
      }
      await carAdRepository.remove(carAd);
    });
  }
}
