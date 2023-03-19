import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { JwtAccessGuard } from 'libs/common/guards/jwt-access.guard';
import { Request } from 'express';
import { GetMyInfoResult } from 'shared';

@Controller('api/user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  async getMyInfo(@Req() req: Request): Promise<GetMyInfoResult> {
    const user = await this.usersService.getUser({ id: req.user['userId'] });
    delete user.password;

    return user;
  }
}
