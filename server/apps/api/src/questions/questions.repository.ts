import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { MongodbPrismaService } from 'libs/prisma/src/mongodb-prisma.service';
import { CreateQuestionDto, LikeQuestionDto } from '@api/src/questions/dto';
import { PAGENUM, Question, ToquizUser } from 'shared';

@Injectable()
export class QuestionsRepository {
  constructor(
    private mysqlService: MysqlPrismaService,
    private mongodbService: MongodbPrismaService,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return await this.mysqlService.question.create({ data: createQuestionDto });
  }

  async getPanelsByToquizUserId(
    toquizUserId: ToquizUser['id'],
  ): Promise<{ panels: { panelId: string }[] }> {
    return await this.mongodbService.toquizUser.findUnique({
      where: { id: toquizUserId },
      select: { panels: { select: { panelId: true } } },
    });
  }

  async getPanelLikesOfToquizUser(
    toquizUserId: ToquizUser['id'],
  ): Promise<{ panelId: string; likes: string[] }[]> {
    const panelInfo = await this.mongodbService.toquizUser.findUnique({
      where: { id: toquizUserId },
      select: { panels: { select: { panelId: true, likes: true } } },
    });
    return panelInfo.panels;
  }

  async insertQuestionToToquizUserFirst(
    panelId: Question['panelId'],
    questionId: Question['id'],
    toquizUserId: Question['toquizUserId'],
  ): Promise<void> {
    await this.mongodbService.toquizUser.update({
      where: { id: toquizUserId },
      data: {
        panels: {
          push: [{ panelId: panelId, questions: [questionId], likes: [] }],
        },
      },
    });
  }

  async insertQuestionToToquizUser(
    panelId: Question['panelId'],
    questionId: Question['id'],
    toquizUserId: Question['toquizUserId'],
  ): Promise<void> {
    await this.mongodbService.toquizUser.update({
      where: { id: toquizUserId },
      data: {
        panels: {
          updateMany: {
            where: { panelId: panelId },
            data: { questions: { push: questionId } },
          },
        },
      },
    });
  }

  async getQuestionsPageFirst(panelId: Question['panelId']): Promise<Question[]> {
    return await this.mysqlService.question.findMany({
      take: PAGENUM,
      where: { panelId: panelId },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async getQuestionsPage(
    panelId: Question['panelId'],
    cursor: Question['id'],
  ): Promise<Question[]> {
    return await this.mysqlService.question.findMany({
      skip: 1,
      take: PAGENUM,
      cursor: { id: cursor },
      where: { panelId: panelId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async insertLikeToToquizUserFirst(likeQuestionDto: LikeQuestionDto): Promise<void> {
    const { panelId, questionId, toquizUserId } = likeQuestionDto;
    await this.mongodbService.toquizUser.update({
      where: { id: toquizUserId },
      data: {
        panels: {
          push: [{ panelId: panelId, questions: [], likes: [questionId] }],
        },
      },
    });
  }

  async insertLikeToToquizUser(likeQuestionDto: LikeQuestionDto): Promise<void> {
    const { panelId, questionId, toquizUserId } = likeQuestionDto;
    await this.mongodbService.toquizUser.update({
      where: { id: toquizUserId },
      data: {
        panels: {
          updateMany: {
            where: { panelId: panelId },
            data: { likes: { push: questionId } },
          },
        },
      },
    });
  }

  async updateLikeToToquizUser(likeQuestionDto: LikeQuestionDto, likes): Promise<void> {
    const { panelId, toquizUserId } = likeQuestionDto;
    await this.mongodbService.toquizUser.update({
      where: { id: toquizUserId },
      data: {
        panels: {
          updateMany: {
            where: { panelId: panelId },
            data: { likes: [...likes] },
          },
        },
      },
    });
  }

  async incrementLikeNumToQuestion(questionId: Question['id']): Promise<void> {
    await this.mysqlService.question.update({
      where: { id: questionId },
      data: { likeNum: { increment: 1 } },
    });
  }

  async decrementLikeNumToQuestion(questionId: Question['id']): Promise<void> {
    await this.mysqlService.question.update({
      where: { id: questionId },
      data: { likeNum: { decrement: 1 } },
    });
  }
}
