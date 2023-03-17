import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { JwtAccessGuard } from 'libs/common/guards/jwt-access.guard';
import { Request } from 'express';
import { GetUserInfoResult } from 'shared';

@Controller('api/user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  async getUserInfo(@Req() req: Request): Promise<GetUserInfoResult> {
    const user = await this.usersService.getUser({ id: req.user['userId'] });
    delete user.password;

    return user;
  }
}
