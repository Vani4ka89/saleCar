import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [UserController],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }, UserService],
  exports: [UserService],
})
export class UserModule {}
