import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AccountTypeEntity } from '../../../database/entities/account-type.entity';

@Injectable()
export class AccountTypeRepository extends Repository<AccountTypeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AccountTypeEntity, dataSource.manager);
  }
}
