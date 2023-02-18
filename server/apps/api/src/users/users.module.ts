import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { SignToken } from 'libs/utils/sign-token';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, ConfigService, JwtService, SignToken],
})
export class UsersModule {}
