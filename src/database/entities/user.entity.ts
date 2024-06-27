import { Column, Entity, OneToMany } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { AdEntity } from './ad.entity';
import { MessageEntity } from './message.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { EAccountType } from '../../modules/auth/enums/account-type.enum';
import { ERole } from '../../common/enums/role.enum';

@Entity(ETableName.USER)
export class UserEntity extends BaseModel {
  @Column('text', { nullable: true })
  name?: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('enum', { enum: ERole, default: ERole.SELLER })
  role: ERole;

  @Column('enum', { enum: EAccountType, default: EAccountType.BASIC })
  accountType: EAccountType;

  @Column('text', { nullable: true })
  image?: string;

  @OneToMany(() => AdEntity, (entity) => entity.user)
  ads?: AdEntity[];

  @OneToMany(() => MessageEntity, (entity) => entity.user)
  messages?: MessageEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
