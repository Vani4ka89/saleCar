import {
  BadRequestException,
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
  CarAdResponseWithOutUserDto,
} from '../models/dto/response/car-ad.response.dto';
import { CarAdMapper } from './car-ad.mapper';
import { S3Service } from './s3.service';
import { EAccountType } from '../../auth/enums/account-type.enum';
import { CarAdRepository } from '../../repository/services/car-ad.repository';
import { CarAdStatisticRequestDto } from '../models/dto/request/car-ad-statistic-request.dto';
import { CarAdStatisticsResponseDto } from '../models/dto/response/car-ad-statistics-response.dto';
import { ExchangeRateService } from './exchange-rate.service';
import { ECurrency } from '../enums/currency.enum';

@Injectable()
export class CarAdService {
  constructor(
    private readonly carAdRepository: CarAdRepository,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async createCarAd(
    dto: CreateCarAdRequestDto,
    userData: IUserData,
  ): Promise<CarAdResponseWithOutUserDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const user = await this.userService.findByIdOrThrow(userData.userId, em);
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
      const { currency, price } = dto;
      const rates = await this.exchangeRateService.getRatesMap(em);

      const priceUSD =
        currency === ECurrency.USD ? price : price / rates[currency];
      const priceEUR =
        currency === ECurrency.EUR
          ? price
          : (price / rates[currency]) * rates[ECurrency.EUR];
      const priceUAH =
        currency === ECurrency.UAH
          ? price
          : (price / rates[currency]) * rates[ECurrency.UAH];

      const car = await carAdRepository.save(
        carAdRepository.create({
          ...dto,
          user_id: user.id,
          priceUAH,
          priceUSD,
          priceEUR,
          exchangeRate: JSON.stringify(rates),
        }),
      );
      return CarAdMapper.toResponseWithOutUserDto(car);
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

  public async getCarAdById(carAdId: string): Promise<CarAdResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const cardARepository = em.getRepository(CarAdEntity);
      const carAdEntity = await cardARepository.findOne({
        where: { id: carAdId },
        relations: {
          user: true,
        },
      });
      if (!carAdEntity) {
        throw new UnprocessableEntityException('CarAd not found');
      }
      carAdEntity.views += 1;
      await cardARepository.save(carAdEntity);
      return CarAdMapper.toResponseDto(carAdEntity);
    });
  }

  public async editMyCarAd(
    userData: IUserData,
    carAdId: string,
    dto: UpdateCarAdRequestDto,
  ): Promise<CarAdResponseWithOutUserDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository = em.getRepository(CarAdEntity);
      const carAd = await carAdRepository.findOneBy({
        id: carAdId,
        user_id: userData.userId,
      });
      if (!carAd) {
        throw new NotFoundException('Car advertisement not found');
      }
      if (carAd.editCount >= 3) {
        throw new BadRequestException(
          'Maximum edit advertisement 3 times only',
        );
      }

      const { currency, price } = dto;
      const rates = await this.exchangeRateService.getRatesMap(em);

      if (currency !== undefined) {
        carAd.currency = currency;
      }
      if (price !== undefined) {
        carAd.price = price;
      }

      carAd.priceUSD =
        carAd.currency === ECurrency.USD
          ? carAd.price
          : carAd.price / rates[carAd.currency];
      carAd.priceEUR =
        carAd.currency === ECurrency.EUR
          ? carAd.price
          : (carAd.price / rates[carAd.currency]) * rates[ECurrency.EUR];
      carAd.priceUAH =
        carAd.currency === ECurrency.UAH
          ? carAd.price
          : (carAd.price / rates[carAd.currency]) * rates[ECurrency.UAH];

      carAd.exchangeRate = JSON.stringify(rates);
      carAd.editCount += 1;

      const editedCarAd = await carAdRepository.save(
        carAdRepository.merge(carAd, dto),
      );
      return CarAdMapper.toResponseWithOutUserDto(editedCarAd);
    });
  }

  async updateExchangeRates(): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const rates = await this.exchangeRateService.getRatesMap(em);
      const carAds = await carAdRepository.find();

      for (const ad of carAds) {
        ad.priceUSD =
          ad.currency === ECurrency.USD
            ? ad.price
            : ad.price / rates[ad.currency];
        ad.priceEUR =
          ad.currency === ECurrency.EUR
            ? ad.price
            : (ad.price / rates[ad.currency]) * rates[ECurrency.EUR];
        ad.priceUAH =
          ad.currency === ECurrency.UAH
            ? ad.price
            : (ad.price / rates[ad.currency]) * rates[ECurrency.UAH];

        ad.exchangeRate = JSON.stringify(rates);

        await carAdRepository.save(ad);
      }
    });
  }

  //TODO
  public async removeAllNotValidCarAds(): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const carAd = await carAdRepository.find({
        where: { isActive: false },
      });
      if (!carAd) {
        throw new UnprocessableEntityException('Car advertisements not found');
      }
      carAd.map(async (ad) => {
        if (ad.image) {
          await this.s3Service.deleteFile(ad.image, em);
        }
        await carAdRepository.remove(carAd);
      });
    });
  }

  public async removeCarAdById(carAdId: string): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const carAd = await carAdRepository.findOneBy({
        id: carAdId,
      });
      if (!carAd) {
        throw new UnprocessableEntityException('Car advertisement not found');
      }
      if (carAd.image) {
        await this.s3Service.deleteFile(carAd.image, em);
      }
      await carAdRepository.remove(carAd);
    });
  }

  public async uploadPhoto(
    photo: Express.Multer.File,
    carAdId: string,
    userData: IUserData,
  ): Promise<CarAdResponseWithOutUserDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const carAd = await carAdRepository.findOneBy({
        user_id: userData.userId,
        id: carAdId,
      });
      if (carAd.image) {
        await this.s3Service.deleteFile(carAd.image, em);
      }
      const filePath = await this.s3Service.uploadFile(
        photo,
        EFileType.CAR_PHOTO,
        carAd.id,
        em,
      );
      const car = await carAdRepository.save(
        carAdRepository.merge(carAd, {
          image: filePath,
          user_id: userData.userId,
        }),
      );
      return CarAdMapper.toResponseWithOutUserDto(car);
    });
  }

  public async getCarAdStatistics(
    dto: CarAdStatisticRequestDto,
    userData: IUserData,
  ): Promise<CarAdStatisticsResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const user = await this.userService.findByIdOrThrow(userData.userId, em);
      if (user.accountType !== EAccountType.PREMIUM) {
        throw new ForbiddenException(
          'Access denied. Only premium users can access statistics',
        );
      }
      const userAds = await this.carAdRepository.getCarAdsStatistics(dto, em);
      const averagePrice =
        userAds.reduce((acc, ad) => acc + ad.price, 0) / userAds.length;
      const totalViews = userAds.reduce((acc, ad) => acc + ad.views, 0);
      return {
        averagePrice,
        totalViews,
      };
    });
  }
}
