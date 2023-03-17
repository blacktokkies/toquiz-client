import { Injectable } from '@nestjs/common';
import { CreatePanelDto } from '@api/src/panels/dto';
import { Panel } from 'shared';
import { PanelsRepository } from '@api/src/panels/panels.repository';

@Injectable()
export class PanelsService {
  constructor(private panelsRepository: PanelsRepository) {}

  async createPanel(createPanelDto: CreatePanelDto): Promise<Panel> {
    return await this.panelsRepository.createPanel(createPanelDto);
  }

  async getPanel(panelId: Panel['id']): Promise<Panel> {
    return await this.panelsRepository.findPanel({ id: panelId });
  }
}
