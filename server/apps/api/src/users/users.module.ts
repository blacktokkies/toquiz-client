import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'libs/common/authorization/auth.module';
import { UserController } from '@users/user.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController, UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
