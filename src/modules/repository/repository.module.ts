import { Global, Module } from '@nestjs/common';
import { CarAdRepository } from './services/car-ad.repository';
import { MessageRepository } from './services/message.repository';
import { UserRepository } from './services/user.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';

const repositories = [
  CarAdRepository,
  MessageRepository,
  UserRepository,
  RefreshTokenRepository,
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
