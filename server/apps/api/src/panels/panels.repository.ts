import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { Panel } from 'shared';
import { Prisma } from 'libs/prisma/prisma/generated/mysql';
import { CreatePanelDto } from '@api/src/panels/dto';

@Injectable()
export class PanelsRepository {
  constructor(private mysqlService: MysqlPrismaService) {}

  async createPanel(createPanelDto: CreatePanelDto): Promise<Panel> {
    return await this.mysqlService.panel.create({ data: createPanelDto });
  }

  async findPanel(panelWhereInput: Prisma.PanelWhereInput): Promise<Panel> {
    return await this.mysqlService.panel.findFirst({ where: { ...panelWhereInput } });
  }
}
