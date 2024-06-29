import { BaseModel } from './models/base.model';
import { Column, Entity } from 'typeorm';
import { ETableName } from './enums/table-name.enum';

@Entity(ETableName.CURRENCY)
export class CurrencyEntity extends BaseModel {
  @Column('text')
  ccy: string;

  @Column('text')
  base_ccy: string;

  @Column('text')
  buy: number;

  @Column('text')
  sale: number;
}
