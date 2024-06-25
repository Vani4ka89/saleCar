import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';
import { CurrencyEntity } from './currency.entity';

@Entity(ETableName.ADVERTISEMENT)
export class AdEntity extends BaseModel {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  price: number;

  @Column()
  ad_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.ads)
  @JoinColumn({ name: 'ad_id' })
  user?: UserEntity;

  @Column()
  currency_id: string;
  @ManyToOne(() => CurrencyEntity, (entity) => entity.ads)
  @JoinColumn({ name: 'currency_id' })
  currency?: CurrencyEntity;

  // @ManyToOne(() => Vehicle, vehicle => vehicle.ads)
  // vehicle: Vehicle;
  //
  //
  // @ManyToOne(() => AdStatus, status => status.ads)
  // status: AdStatus;
}
