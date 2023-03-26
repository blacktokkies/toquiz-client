import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PanelsService } from '@api/src/panels/panels.service';
import { GetPanelResult, Panel, ToquizUser } from 'shared';
import { ToquizGuard } from 'libs/common/guards/toquiz.guard';
import { ToquizUserId } from 'libs/common/decorators/toquiz-user-id.decorator';

@Controller('/api/panels')
export class PanelsController {
  constructor(private panelsService: PanelsService) {}

  @Get(':panelId')
  @UseGuards(ToquizGuard)
  async getPanel(
    @Param('panelId') panelId: Panel['id'],
    @ToquizUserId() toquizUserId: ToquizUser['id'],
  ): Promise<GetPanelResult> {
    return await this.panelsService.getPanel(panelId, toquizUserId);
  }
}
