import { Module } from '@nestjs/common';
import { PrismaService } from 'libs/prisma.service';
import { PanelController } from './panel.controller';
import { PanelService } from './panel.service';

@Module({
  imports: [],
  controllers: [PanelController],
  providers: [PanelService, PrismaService],
})
export class PanelModule {}
