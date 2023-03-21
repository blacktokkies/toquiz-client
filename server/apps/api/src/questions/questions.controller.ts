import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { QuestionsService } from '@api/src/questions/questions.service';
import { GetPanelQuestionsResult, LikeQuestionResult, Question } from 'shared';
import { ReceivedData } from 'libs/common/decorators/ReceivedData.decorator';
import { ToquizGuard } from 'libs/common/guards/toquiz.guard';
import { LikeQuestionDto } from '@api/src/questions/dto';

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

  @Post(':questionId/like')
  @UseGuards(ToquizGuard)
  async likeQuestion(
    @ReceivedData() likeQuestionDto: LikeQuestionDto,
  ): Promise<LikeQuestionResult> {
    await this.questionsService.likeQuestion(likeQuestionDto);
    return { message: 'success to like' };
  }
}
