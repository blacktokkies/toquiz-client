import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestionsService } from '@api/src/questions/questions.service';
import { GetPanelQuestionsResult, Question } from 'shared';

@Controller('api/panels/:panelId/questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async getPanelQuestions(
    @Param('panelId') panelId: Question['panelId'],
    @Query('cursor') cursor?: Question['id'],
  ): Promise<GetPanelQuestionsResult> {
    return await this.questionsService.getPanelQuestions(panelId, cursor);
  }
}
