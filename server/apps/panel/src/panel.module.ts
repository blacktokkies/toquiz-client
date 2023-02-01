import { Module } from '@nestjs/common';
import { MysqlPrismaService, MongodbPrismaService } from 'libs/prisma-service';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';

@Module({
  imports: [],
  controllers: [PanelController],
  providers: [PanelService, MysqlPrismaService, MongodbPrismaService],
})
export class PanelModule {}
