import { Controller, Post, UseGuards } from '@nestjs/common';
import { ReceivedData } from 'libs/common/decorators/ReceivedData.decorator';
import { CreateQuestionDto } from '@api/src/questions/dto';
import { ToquizGuard } from 'libs/common/guards/toquiz.guard';
import { QuestionsService } from '@api/src/questions/questions.service';
import { Question } from 'shared';

@Controller('api/panels/:panelId/question')
export class QuestionController {
  constructor(private questionsService: QuestionsService) {}

  @Post()
  @UseGuards(ToquizGuard)
  async createQuestion(@ReceivedData() createQuestionDto: CreateQuestionDto): Promise<Question> {
    return await this.questionsService.createQuestion(createQuestionDto);
  }
}
