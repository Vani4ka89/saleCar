import * as process from 'node:process';

import { ConfigType } from './config.type';

export default (): ConfigType => ({
  app: {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT, 10),
  },

  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
  },

  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpire: parseInt(process.env.ACCESS_TOKEN_EXPIRE, 10),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpire: parseInt(process.env.REFRESH_TOKEN_EXPIRE, 10),
  },

  awsS3: {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_OBJECT_ACL: process.env.AWS_OBJECT_ACL,
    AWS_S3_URL: process.env.AWS_S3_URL,
  },
});
