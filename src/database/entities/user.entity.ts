import { Column, Entity, OneToMany } from 'typeorm';
import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { CarAdEntity } from './car-ad.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { EAccountType } from '../../modules/auth/enums/account-type.enum';
import { ERole } from '../../common/enums/role.enum';
import { ViewEntity } from './view.entity';

@Entity(ETableName.USER)
export class UserEntity extends BaseModel {
  @Column('text', { nullable: true })
  name?: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('enum', { enum: ERole, default: ERole.SELLER })
  role: string;

  @Column('enum', { enum: EAccountType, default: EAccountType.BASIC })
  accountType: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column({ type: 'boolean', default: false })
  banned: boolean;

  @Column('text', { nullable: true })
  banReason?: string;

  @OneToMany(() => ViewEntity, (entity) => entity.user)
  views?: ViewEntity[];

  @OneToMany(() => CarAdEntity, (entity) => entity.user)
  ads?: CarAdEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
