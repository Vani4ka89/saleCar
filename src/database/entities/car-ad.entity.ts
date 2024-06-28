import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

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

  @Column('text', { nullable: true })
  image?: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.ads)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
