import { DataSource } from 'typeorm';
import getConfig from './src/configs/configuration';
import * as path from 'node:path';
import * as process from 'node:process';

import { config } from 'dotenv';
config({ path: '.env' });
const postgresConfig = getConfig().postgres;

export default new DataSource({
  type: 'postgres',
  host: postgresConfig.host,
  port: +postgresConfig.port,
  username: postgresConfig.user,
  password: postgresConfig.password,
  database: postgresConfig.dbName,
  entities: [
    path.join(process.cwd(), 'src', 'database', 'entities', '*.entity.ts'),
  ],
  migrations: [
    path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: false,
});
