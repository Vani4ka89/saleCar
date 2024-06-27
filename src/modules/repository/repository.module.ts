import { Global, Module } from '@nestjs/common';
import { AdRepository } from './services/ad.repository';
import { CurrencyRepository } from './services/currency.repository';
import { MessageRepository } from './services/message.repository';
import { UserRepository } from './services/user.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';

const repositories = [
  AdRepository,
  CurrencyRepository,
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
