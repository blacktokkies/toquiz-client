import { Module } from '@nestjs/common';
import { MysqlPrismaService, MongodbPrismaService } from 'libs/prisma-service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, MysqlPrismaService, MongodbPrismaService],
})
export class UserModule {}
