import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RoleEntity } from './role.entity';
import { AccountTypeEntity } from './account-type.entity';
import { AdEntity } from './ad.entity';
import { MessageEntity } from './message.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity(ETableName.USER)
export class UserEntity extends BaseModel {
  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column()
  role_id: string;
  @ManyToOne(() => RoleEntity, (entity) => entity.users)
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity;

  @Column()
  accountType_id: string;
  @ManyToOne(() => AccountTypeEntity, (entity) => entity.users)
  @JoinColumn({ name: 'accountType_id' })
  accountType?: AccountTypeEntity;

  @OneToMany(() => AdEntity, (entity) => entity.user)
  ads?: AdEntity[];

  @OneToMany(() => MessageEntity, (entity) => entity.user)
  messages?: MessageEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  // @OneToMany(() => Favorite, (favorite) => favorite.user)
  // favorites: Favorite[];
  //
}
