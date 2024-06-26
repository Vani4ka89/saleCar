import { Global, Module } from '@nestjs/common';
import { AccountTypeRepository } from './services/account-type.repository';
import { AdRepository } from './services/ad.repository';
import { CurrencyRepository } from './services/currency.repository';
import { MessageRepository } from './services/message.repository';
import { RoleRepository } from './services/role.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  AccountTypeRepository,
  AdRepository,
  CurrencyRepository,
  MessageRepository,
  RoleRepository,
  UserRepository,
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
