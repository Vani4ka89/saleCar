import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './services/email.service';
import { Module } from '@nestjs/common';
import * as path from 'node:path';
import * as process from 'node:process';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'ivan.tym4ak@gmail.com',
          pass: 'djljvxdukglxdvau',
        },
      },
      defaults: {
        from: 'No Reply',
      },
      template: {
        dir: path.join(process.cwd(), 'src', 'modules', 'email', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
