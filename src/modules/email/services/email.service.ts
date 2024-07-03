import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CarAdEntity } from '../../../database/entities/car-ad.entity';
import * as path from 'node:path';
import * as process from 'node:process';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  public async sendNotificationToManager(carAd: CarAdEntity): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: 'ivan.tym4ak@gmail.com',
        subject: 'Car Ad Deactivated for Review',
        template: path.join(
          process.cwd(),
          'src',
          'modules',
          'email',
          'templates',
          'car-ad',
        ),
        context: {
          carAdId: carAd.id,
          title: carAd.title,
          description: carAd.description,
          userId: carAd.user_id,
        },
      });
      this.logger.log('Email sent successfully');
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }
}
