import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReceivedData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return {
    ...req.body,
    ...req.params,
    ...req.query,
    userId: req.user.id,
  };
});
