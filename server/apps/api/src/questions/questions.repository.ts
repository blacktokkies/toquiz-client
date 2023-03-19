import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from 'libs/prisma/src/mysql-prisma.service';
import { MongodbPrismaService } from 'libs/prisma/src/mongodb-prisma.service';
import { CreateQuestionDto } from '@api/src/questions/dto';
import { Question } from 'shared';

@Injectable()
export class QuestionsRepository {
  constructor(
    private mysqlService: MysqlPrismaService,
    private mongodbService: MongodbPrismaService,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return await this.mysqlService.question.create({ data: createQuestionDto });
  }

  async insertQuestionToToquizUser(
    panelId: Question['panelId'],
    questionId: Question['id'],
    toquizUserId: Question['toquizUserId'],
  ) {
    const user = await this.mongodbService.toquizUser.findUnique({
      where: { id: toquizUserId },
      select: { panels: true },
    });
    const existingPanel = user.panels.find((panel) => panel.panelId === panelId);

    if (existingPanel) {
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
    } else {
      // 패널에서 첫 활동일 경우(panels 배열에 생성 필요)
      await this.mongodbService.toquizUser.update({
        where: { id: toquizUserId },
        data: {
          panels: {
            push: [{ panelId: panelId, questions: [questionId], likes: [] }],
          },
        },
      });
    }
  }
}
