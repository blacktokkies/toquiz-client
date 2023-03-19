import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '@api/src/questions/dto';
import { Question } from 'shared';
import { QuestionsRepository } from '@api/src/questions/questions.repository';

@Injectable()
export class QuestionsService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const { panelId, toquizUserId } = createQuestionDto;
    const question = await this.questionsRepository.createQuestion(createQuestionDto);
    await this.questionsRepository.insertQuestionToToquizUser(panelId, question.id, toquizUserId);

    return question;
  }
}
