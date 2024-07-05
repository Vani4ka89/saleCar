import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import * as path from 'node:path';
import * as process from 'node:process';
import { MissingBrandDto } from '../../car_ad/models/dto/request/missing-brand-request.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  private async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
    em?: EntityManager,
  ): Promise<void> {
    return await em.transaction(async () => {
      try {
        await this.mailerService.sendMail({
          to,
          subject,
          template: path.join(
            process.cwd(),
            'src',
            'modules',
            'email',
            'templates',
            templateName,
          ),
          context,
        });
        this.logger.log('Email sent successfully');
      } catch (error) {
        this.logger.error('Error sending email', error);
      }
    });
  }

  public async sendNotificationToManager(
    carAd: CarAdEntity,
    em?: EntityManager,
  ): Promise<void> {
    return await em.transaction(async (em: EntityManager) => {
      const context = {
        carAdId: carAd.id,
        title: carAd.title,
        description: carAd.description,
        brand: carAd.brand,
        model: carAd.model,
        year: carAd.year,
        price: carAd.price,
        userId: carAd.user_id,
      };

      await this.sendEmail(
        'ivan.tym4ak@gmail.com',
        'Advertisement Deactivated for Review🚘',
        'car-ad',
        context,
        em,
      );
    });
  }

  public async sendMissingBrandMessageToManager(
    dto: MissingBrandDto,
    em?: EntityManager,
  ): Promise<void> {
    return await em.transaction(async (em: EntityManager) => {
      const context = {
        additionalInfo: dto.additionalInfo,
        brandName: dto.brandName,
      };

      await this.sendEmail(
        'ivan.tym4ak@gmail.com',
        'Missing Brand for Review🚘',
        'missing-brand',
        context,
        em,
      );
    });
  }
}
