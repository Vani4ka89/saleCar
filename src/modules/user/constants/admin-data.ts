import { ERole } from '../../../common/enums/role.enum';
import { EAccountType } from '../../auth/enums/account-type.enum';
import { CreateAdminRequestDto } from '../models/dto/request/create-admin-request.dto';

export const adminData: CreateAdminRequestDto = {
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'P@$$word123qwe',
  role: ERole.ADMIN,
  accountType: EAccountType.PREMIUM,
};
