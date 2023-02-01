import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as MysqlPrismaClient } from '../../prisma/generated/mysql';

@Injectable()
export class MysqlPrismaService extends MysqlPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
