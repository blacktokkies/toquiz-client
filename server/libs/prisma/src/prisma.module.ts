import { Global, Module } from '@nestjs/common';
import { MysqlPrismaService } from './mysql-prisma.service';
import { MongodbPrismaService } from './mongodb-prisma.service';

@Global()
@Module({
  providers: [MysqlPrismaService, MongodbPrismaService],
  exports: [MysqlPrismaService, MongodbPrismaService],
})
export class PrismaModule {}
