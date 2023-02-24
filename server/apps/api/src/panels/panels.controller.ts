import { Controller, Get, Param } from '@nestjs/common';
import { PanelsService } from '@api/src/panels/panels.service';
import { Panel } from 'shared';

@Controller('/api/panels')
export class PanelsController {
  constructor(private panelsService: PanelsService) {}

  @Get(':panelId')
  async getPanel(@Param('panelId') panelId: Panel['id']): Promise<Panel> {
    return this.panelsService.getPanel(panelId);
  }
}
