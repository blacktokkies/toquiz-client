import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { MongodbPrismaService } from 'libs/prisma/src/mongodb-prisma.service';
import { CreateQuestionDto } from '@api/src/questions/dto';
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
}
