import { Column, Entity, OneToMany } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { AdEntity } from './ad.entity';

@Entity(ETableName.CURRENCY)
export class CurrencyEntity extends BaseModel {
  @Column('text')
  name: string;

  @OneToMany(() => AdEntity, (entity) => entity.currency)
  ads?: AdEntity[];
}
