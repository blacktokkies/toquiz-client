import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '@api/src/questions/dto';
import { GetPanelQuestionsResult, Question } from 'shared';
import { QuestionsRepository } from '@api/src/questions/questions.repository';

@Injectable()
export class QuestionsService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const { panelId, toquizUserId } = createQuestionDto;
    const question = await this.questionsRepository.createQuestion(createQuestionDto);

    const user = await this.questionsRepository.getPanelsByToquizUserId(toquizUserId);
    const existingPanel = user.panels.find((panel) => panel.panelId === panelId);

    if (existingPanel) {
      await this.questionsRepository.insertQuestionToToquizUser(panelId, question.id, toquizUserId);
    } else {
      await this.questionsRepository.insertQuestionToToquizUserFirst(
        panelId,
        question.id,
        toquizUserId,
      );
    }

    return question;
  }

  async getPanelQuestions(
    panelId: Question['panelId'],
    cursor: Question['id'] | null,
  ): Promise<GetPanelQuestionsResult> {
    let questions: Question[];
    if (cursor) questions = await this.questionsRepository.getQuestionsNextPage(panelId, cursor);
    else questions = await this.questionsRepository.getQuestionsFirstPage(panelId);

    const nextCursor = questions?.at(-1)?.id;

    return { questions, nextCursor };
  }
}
