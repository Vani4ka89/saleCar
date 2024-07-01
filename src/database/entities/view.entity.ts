import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './models/base.model';
import { ETableName } from './enums/table-name.enum';
import { UserEntity } from './user.entity';
import { CarAdEntity } from './car-ad.entity';

@Entity(ETableName.VIEW)
export class ViewEntity extends BaseModel {
  @Column('int', { default: 0 })
  value: number;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.views)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column()
  carAd_id: string;
  @ManyToOne(() => CarAdEntity, (entity) => entity.views)
  @JoinColumn({ name: 'carAd_id' })
  carAd?: CarAdEntity;
}
