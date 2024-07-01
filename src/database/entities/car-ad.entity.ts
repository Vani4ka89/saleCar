import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';
import { ViewEntity } from './view.entity';

@Entity(ETableName.ADVERTISEMENT)
export class CarAdEntity extends BaseModel {
  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text')
  brand: string;

  @Column('text')
  model: string;

  @Column('int')
  price: number;

  @Column('int')
  year: number;

  @Column('text')
  currency: string;

  @Column('decimal', { nullable: true })
  priceUSD?: number;

  @Column('decimal', { nullable: true })
  priceEUR?: number;

  @Column('decimal', { nullable: true })
  priceUAH?: number;

  @Column('text')
  exchangeRate: string;

  @Column('text')
  region: string;

  @Column('boolean', { default: false })
  isActive: boolean;

  @Column('text', { nullable: true })
  image?: string;

  @Column('int', { default: 0 })
  editCount: number;

  @OneToMany(() => ViewEntity, (entity) => entity.carAd)
  views?: ViewEntity[];

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.ads)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
