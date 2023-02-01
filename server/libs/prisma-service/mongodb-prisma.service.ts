import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as MongodbPrismaClient } from '../../prisma/generated/mongodb';

@Injectable()
export class MongodbPrismaService extends MongodbPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
