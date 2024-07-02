export type ConfigType = {
  app: AppConfig;
  postgres: PostgresConfig;
  redis: RedisConfig;
  jwt: JwtConfig;
  awsS3: AwsS3Config;
};

export type AppConfig = {
  host: string;
  port: number;
};

export type PostgresConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  host: string;
  port: number;
  password: string;
};

export type JwtConfig = {
  secretSalt: string | number;
  accessTokenSecret: string;
  accessTokenExpire: number;
  refreshTokenSecret: string;
  refreshTokenExpire: number;
};

export type AwsS3Config = {
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
  AWS_BUCKET_NAME: string;
  AWS_REGION: string;
  AWS_OBJECT_ACL: string;
  AWS_S3_URL: string;
};
