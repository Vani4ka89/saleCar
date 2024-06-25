import { DataSource } from 'typeorm';
import getConfig from 'src/configs/configuration';
import path from 'node:path';
import process from 'node:process';

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
  migrations: [path.join(process.cwd(), 'src', 'database', 'entities', '*.ts')],
  synchronize: false,
});
