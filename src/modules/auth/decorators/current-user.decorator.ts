import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserData } from '../types/user-data.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IUserData;
  },
);
