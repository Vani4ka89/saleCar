import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import * as path from 'node:path';
import * as process from 'node:process';
import { MissingBrandDto } from '../../car_ad/models/dto/request/missing-brand-request.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  private async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ): Promise<void> {
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
  }

  public async sendNotificationToManager(carAd: CarAdEntity): Promise<void> {
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
    );
  }

  public async sendMissingBrandMessageToManager(
    dto: MissingBrandDto,
  ): Promise<void> {
    const context = {
      additionalInfo: dto.additionalInfo,
      brandName: dto.brandName,
    };

    await this.sendEmail(
      'ivan.tym4ak@gmail.com',
      'Missing Brand for Review🚘',
      'missing-brand',
      context,
    );
  }
}
