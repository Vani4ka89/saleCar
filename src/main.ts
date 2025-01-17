import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfig, ConfigType } from './configs/config.type';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';
import { UserService } from './modules/user/services/user.service';
import { adminData } from './modules/user/constants/admin-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sale🚘Cars Platform')
    .setDescription('The sale-cars API description')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelExpandDepth: 1,
      docExpansion: 'list',
      persistAuthorization: true,
    },
  });

  app.enableCors({ origin: true });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const userService = app.get(UserService);
  const admin = await userService.isAdminExist(adminData.email);
  if (!admin) {
    await userService.createAdmin(adminData);
    Logger.log('User admin was created successfully');
  }

  const configService = app.get(ConfigService<ConfigType>);
  const appConfig = configService.get<AppConfig>('app');
  await app.listen(appConfig.port, () => {
    const url = `http://${appConfig.host}:${appConfig.port}`;
    Logger.log(`Server is running at ${url}`);
    Logger.log(`Swagger is running at ${url}/docs`);
  });
}

void bootstrap();
