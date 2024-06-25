import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity(ETableName.MESSAGE)
export class MessageEntity extends BaseModel {
  @Column('text')
  content: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.messages)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
