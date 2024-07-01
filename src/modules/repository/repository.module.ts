import { Global, Module } from '@nestjs/common';
import { CarAdRepository } from './services/car-ad.repository';
import { MessageRepository } from './services/message.repository';
import { UserRepository } from './services/user.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { CurrencyRepository } from './services/currency.repository';
import { ViewRepository } from './services/view.repository';

const repositories = [
  CarAdRepository,
  CurrencyRepository,
  MessageRepository,
  UserRepository,
  RefreshTokenRepository,
  ViewRepository,
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
