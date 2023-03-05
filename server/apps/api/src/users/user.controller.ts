import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { JwtAccessGuard } from 'libs/common/guards/jwt-access.guard';
import { User } from 'shared';
import { Request } from 'express';

@Controller('api/user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  async getUserInfo(@Req() req: Request): Promise<User> {
    return await this.usersService.getUser({ id: req.user['userId'] });
  }
}
