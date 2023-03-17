import { Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePanelDto } from '@api/src/panels/dto';
import { CreatePanelResult } from 'shared';
import { PanelsService } from '@api/src/panels/panels.service';
import { ReceivedData } from 'libs/common/decorators/ReceivedData.decorator';
import { JwtAccessGuard } from 'libs/common/guards/jwt-access.guard';

@Controller('/api/panel')
export class PanelController {
  constructor(private panelsService: PanelsService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async createPanel(@ReceivedData() createPanelDto: CreatePanelDto): Promise<CreatePanelResult> {
    return await this.panelsService.createPanel(createPanelDto);
  }
}
