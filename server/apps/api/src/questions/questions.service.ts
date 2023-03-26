import { Injectable } from '@nestjs/common';
import { CreateQuestionDto, LikeQuestionDto } from '@api/src/questions/dto';
import { GetPanelQuestionsResult, Question } from 'shared';
import { QuestionsRepository } from '@api/src/questions/questions.repository';

@Injectable()
export class QuestionsService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const { toquizUserId, panelId } = createQuestionDto;
    const question = await this.questionsRepository.createQuestion(createQuestionDto);

    await this.questionsRepository.insertQuestionToToquizUser(panelId, question.id, toquizUserId);

    return question;
  }

  async getPanelQuestions(
    panelId: Question['panelId'],
    cursor: Question['id'] | null,
  ): Promise<GetPanelQuestionsResult> {
    let questions: Question[];
    if (cursor) questions = await this.questionsRepository.getQuestionsPage(panelId, cursor);
    else questions = await this.questionsRepository.getQuestionsPageFirst(panelId);

    const nextCursor = questions?.at(-1)?.id;

    return { questions, nextCursor };
  }

  async likeQuestion(likeQuestionDto: LikeQuestionDto): Promise<void> {
    likeQuestionDto.like
      ? await this.insertLike(likeQuestionDto)
      : await this.removeLike(likeQuestionDto);
  }

  async insertLike(likeQuestionDto: LikeQuestionDto): Promise<void> {
    await this.questionsRepository.insertLikeToToquizUser(likeQuestionDto);
    await this.questionsRepository.incrementLikeNumToQuestion(likeQuestionDto.questionId);
  }

  async removeLike(likeQuestionDto: LikeQuestionDto): Promise<void> {
    const { toquizUserId, panelId, questionId } = likeQuestionDto;

    const panels = await this.questionsRepository.getPanelLikesOfToquizUser(toquizUserId);
    const likes = panels.find((panel) => panel.panelId === panelId).likes;

    await this.questionsRepository.updateLikeToToquizUser(
      likeQuestionDto,
      likes.filter((id) => id != questionId),
    );

    await this.questionsRepository.decrementLikeNumToQuestion(questionId);
  }
}
