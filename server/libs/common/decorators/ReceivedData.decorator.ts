import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReceivedData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const result = {
    ...req.body,
    ...req.params,
    ...req.query,
  };

  if (req?.user?.id) result['userId'] = req.user.id;
  if (req?.cookies?.toquizToken) result['toquizUserId'] = req.cookies.toquizToken;
  return result;
});
