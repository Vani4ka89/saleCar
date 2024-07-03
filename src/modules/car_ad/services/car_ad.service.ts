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
} from '../models/dto/response/car-ad.response.dto';
import { CarAdMapper } from './car-ad.mapper';
import { S3Service } from './s3.service';
import { EAccountType } from '../../auth/enums/account-type.enum';
import { CarAdRepository } from '../../repository/services/car-ad.repository';
import { CarAdStatisticRequestDto } from '../models/dto/request/car-ad-statistic-request.dto';
import { CarAdStatisticsResponseDto } from '../models/dto/response/car-ad-statistics-response.dto';
import { ExchangeRateService } from './exchange-rate.service';
import { ECurrency } from '../enums/currency.enum';
import { ViewEntity } from '../../../database/entities/view.entity';
import { ViewService } from '../../view/services/view.service';
import { ViewRepository } from '../../repository/services/view.repository';
import { EmailService } from '../../email/services/email.service';

@Injectable()
export class CarAdService {
  constructor(
    private readonly carAdRepository: CarAdRepository,
    private readonly viewRepository: ViewRepository,
    private readonly viewService: ViewService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly emailService: EmailService,
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
        currency === ECurrency.USD
          ? price
          : (price / rates[ECurrency.USD]) * rates[currency] ||
            price / rates[ECurrency.USD];
      const priceEUR =
        currency === ECurrency.EUR
          ? price
          : (price / rates[ECurrency.EUR]) * rates[currency] ||
            price / rates[ECurrency.EUR];
      const priceUAH =
        currency === ECurrency.UAH ? price : price * rates[currency];

      const car = await carAdRepository.save(
        carAdRepository.create({
          ...dto,
          user_id: user.id,
          priceUAH,
          priceUSD,
          priceEUR,
          exchangeRate: JSON.stringify(rates),
          isActive: true,
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

  public async getCarAdInfo(
    carAdId: string,
    userData: IUserData,
  ): Promise<CarAdResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const cardARepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const carAd = await cardARepository.findOne({
        where: { id: carAdId },
        relations: {
          user: true,
        },
      });
      if (!carAd) {
        throw new UnprocessableEntityException('CarAd not found');
      }
      let totalViews: number;
      let dailyViews: number;
      let weeklyViews: number;
      let monthlyViews: number;
      let averagePrice: number;
      let averageRegionPrice: number;
      if (userData.accountType === EAccountType.PREMIUM) {
        dailyViews = await this.viewRepository.getDailyViews(carAd.id, em);
        weeklyViews = await this.viewRepository.getWeeklyViews(carAd.id, em);
        monthlyViews = await this.viewRepository.getMonthlyViews(carAd.id, em);
        totalViews = await this.viewService.countViews(carAd.id, em);

        const carAdEntities = await this.carAdRepository.getCarAdsStatistics(
          carAd.brand,
          carAd.model,
          carAd.price,
          em,
        );

        const entities = await this.carAdRepository.getCarAdsRegionStatistics(
          carAd.brand,
          carAd.model,
          carAd.price,
          carAd.region,
          em,
        );

        averagePrice =
          entities.reduce((acc, ad) => acc + ad.price, 0) / entities.length;

        averageRegionPrice =
          carAdEntities.reduce((acc, ad) => acc + ad.price, 0) /
          carAdEntities.length;
      }
      const existingView = await this.viewService.findCarAdView(
        userData.userId,
        carAd.id,
        em,
      );

      if (!existingView) {
        await this.viewService.createCarAdView(userData.userId, carAd.id, em);
      }
      const options = {
        totalViews,
        dailyViews,
        weeklyViews,
        monthlyViews,
        averagePrice,
        averageRegionPrice,
        accType: EAccountType.PREMIUM,
      };
      return CarAdMapper.toResponseDto(carAd, options);
    });
  }

  public async editMyCarAd(
    userData: IUserData,
    carAdId: string,
    dto: UpdateCarAdRequestDto,
  ): Promise<CarAdResponseDto> {
    return await this.entityManager
      .transaction(async (em: EntityManager) => {
        const carAdRepository =
          em.getRepository(CarAdEntity) ?? this.carAdRepository;
        const carAd = await carAdRepository.findOneBy({
          id: carAdId,
          user_id: userData.userId,
        });

        if (!carAd) {
          throw new NotFoundException('Car advertisement not found');
        }

        if (carAd.editCount >= 3) {
          carAd.isActive = false;
          await carAdRepository.save(carAd);
          await this.emailService.sendNotificationToManager(carAd);
          return null;
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
            : (carAd.price / rates[ECurrency.USD]) * rates[carAd.currency] ||
              carAd.price / rates[ECurrency.USD];
        carAd.priceEUR =
          carAd.currency === ECurrency.EUR
            ? carAd.price
            : (carAd.price / rates[ECurrency.EUR]) * rates[carAd.currency] ||
              carAd.price / rates[ECurrency.EUR];
        carAd.priceUAH =
          carAd.currency === ECurrency.UAH
            ? carAd.price
            : carAd.price * rates[carAd.currency];

        carAd.exchangeRate = JSON.stringify(rates);
        carAd.editCount += 1;

        const editedCarAd = await carAdRepository.save(carAd);
        return CarAdMapper.toResponseDto(editedCarAd);
      })
      .then((result) => {
        if (result === null) {
          throw new BadRequestException(
            'Maximum edit advertisement 3 times only',
          );
        }
        return result;
      });
  }

  public async updateExchangeRates(): Promise<void> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const carAdRepository =
        em.getRepository(CarAdEntity) ?? this.carAdRepository;
      const rates = await this.exchangeRateService.getRatesMap(em);
      const carAds = await carAdRepository.find();

      const updatedCarAds = carAds.map((ad) => {
        ad.priceUSD =
          ad.currency === ECurrency.USD
            ? ad.price
            : (ad.price / rates[ECurrency.USD]) * rates[ad.currency] ||
              ad.price / rates[ECurrency.USD];
        ad.priceEUR =
          ad.currency === ECurrency.EUR
            ? ad.price
            : (ad.price / rates[ECurrency.EUR]) * rates[ad.currency] ||
              ad.price / rates[ECurrency.EUR];
        ad.priceUAH =
          ad.currency === ECurrency.UAH
            ? ad.price
            : ad.price * rates[ad.currency];

        ad.exchangeRate = JSON.stringify(rates);

        return carAdRepository.save(ad);
      });
      await Promise.all(updatedCarAds);
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
  ): Promise<CarAdResponseDto> {
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
      return CarAdMapper.toResponseDto(car);
    });
  }

  // public async getCarAdStatistics(
  //   dto: CarAdStatisticRequestDto,
  //   userData: IUserData,
  // ): Promise<CarAdStatisticsResponseDto> {
  //   return await this.entityManager.transaction(async (em: EntityManager) => {
  //     const user = await this.userService.findByIdOrThrow(userData.userId, em);
  //     if (user.accountType !== EAccountType.PREMIUM) {
  //       throw new ForbiddenException(
  //         'Access denied. Only premium users can access statistics',
  //       );
  //     }
  //     const userAds = await this.carAdRepository.getCarAdsStatistics(dto, em);
  //     const averagePrice =
  //       userAds.reduce((acc, ad) => acc + ad.price, 0) / userAds.length;
  //     // const totalViews = userAds.map((ad) => {
  //     //   ad.views.reduce((acc, a) => acc + a.value, 0);
  //     // });
  //     const totalViews = 0;
  //     return {
  //       averagePrice,
  //       totalViews,
  //     };
  //   });
  // }
}
