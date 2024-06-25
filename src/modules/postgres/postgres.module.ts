import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType, PostgresConfig } from '../../configs/config.type';
import * as path from 'node:path';
import * as process from 'node:process';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const postgresConfig = configService.get<PostgresConfig>('postgres');
        return {
          type: 'postgres',
          host: postgresConfig.host,
          port: +postgresConfig.port,
          username: postgresConfig.user,
          password: postgresConfig.password,
          database: postgresConfig.dbName,
          entities: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'database',
              'entities',
              '*.entity.js',
            ),
          ],
          migrations: [
            path.join(
              process.cwd(),
              'dist',
              'src',
              'database',
              'migrations',
              '*.js',
            ),
          ],
          synchronize: false,
          migrationsRun: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class PostgresModule {}
