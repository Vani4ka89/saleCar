import { Column, Entity, OneToMany } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity(ETableName.ROLE)
export class RoleEntity extends BaseModel {
  @Column('text')
  name: string;

  @OneToMany(() => UserEntity, (entity) => entity.role)
  users?: UserEntity[];
}
