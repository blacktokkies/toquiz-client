import { Injectable } from '@nestjs/common';
import { CreatePanelDto } from '@api/src/panels/dto';
import { Panel, Question, ToquizUser } from 'shared';
import { PanelsRepository } from '@api/src/panels/panels.repository';

@Injectable()
export class PanelsService {
  constructor(private panelsRepository: PanelsRepository) {}

  async createPanel(createPanelDto: CreatePanelDto): Promise<Panel> {
    return await this.panelsRepository.createPanel(createPanelDto);
  }

  async getPanel(panelId: Panel['id'], toquizUserId: ToquizUser['id']): Promise<Panel> {
    if (!(await this.isExistPanelSession(toquizUserId, panelId))) {
      await this.panelsRepository.createPanelOfToquizUser(toquizUserId, panelId);
    }

    return await this.panelsRepository.getPanelByPanelId(panelId);
  }

  async isExistPanelSession(
    toquizUserId: Question['toquizUserId'],
    panelId: Question['panelId'],
  ): Promise<boolean> {
    const toquizUser = await this.panelsRepository.getPanelsIdOfToquizUser(toquizUserId);
    const existingPanel = toquizUser.panels.find((panel) => panel.panelId === panelId);

    return Boolean(existingPanel);
  }
}
