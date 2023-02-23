import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { CreatePanelDto } from '@api/src/panels/dto';
import { Panel } from 'shared';

@Injectable()
export class PanelsRepository {
  constructor(private mysqlService: MysqlPrismaService) {}

  async createPanel(createPanelDto: CreatePanelDto): Promise<Panel> {
    return await this.mysqlService.panel.create({ data: createPanelDto });
  }
}
