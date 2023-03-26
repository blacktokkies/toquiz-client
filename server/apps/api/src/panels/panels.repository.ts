import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { MongodbPrismaService } from 'libs/prisma/src/mongodb-prisma.service';
import { Panel, ToquizUser } from 'shared';
import { CreatePanelDto } from '@api/src/panels/dto';

@Injectable()
export class PanelsRepository {
  constructor(
    private mysqlService: MysqlPrismaService,
    private mongodbService: MongodbPrismaService,
  ) {}

  async createPanel(createPanelDto: CreatePanelDto): Promise<Panel> {
    return await this.mysqlService.panel.create({ data: createPanelDto });
  }

  async getPanelByPanelId(panelId: Panel['id']): Promise<Panel> {
    return await this.mysqlService.panel.findFirst({ where: { id: panelId } });
  }

  async getPanelsIdOfToquizUser(
    toquizUserId: ToquizUser['id'],
  ): Promise<{ panels: { panelId: string }[] }> {
    return await this.mongodbService.toquizUser.findUnique({
      where: { id: toquizUserId },
      select: { panels: { select: { panelId: true } } },
    });
  }

  async createPanelOfToquizUser(toquizUserId, panelId): Promise<void> {
    await this.mongodbService.toquizUser.update({
      where: { id: toquizUserId },
      data: {
        panels: {
          push: [{ panelId: panelId, questions: [], likes: [] }],
        },
      },
    });
  }
}
