import { Column, Entity, OneToMany } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity(ETableName.ACCOUNT_TYPE)
export class AccountTypeEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @OneToMany(() => UserEntity, (entity) => entity.accountType)
  users?: UserEntity[];
}
