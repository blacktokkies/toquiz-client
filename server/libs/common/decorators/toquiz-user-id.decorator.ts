import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ToquizUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req?.cookies?.toquizToken;
});
