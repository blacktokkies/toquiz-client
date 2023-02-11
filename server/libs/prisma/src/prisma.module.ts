import { Module } from '@nestjs/common';
import { MysqlPrismaService } from './mysql-prisma.service';
import { MongodbPrismaService } from './mongodb-prisma.service';

@Module({
  providers: [MysqlPrismaService, MongodbPrismaService],
  exports: [MysqlPrismaService, MongodbPrismaService],
})
export class PrismaModule {}
