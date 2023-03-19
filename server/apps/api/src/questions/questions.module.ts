import { Module } from '@nestjs/common';
import { QuestionController } from '@api/src/questions/question.controller';
import { AuthModule } from 'libs/common/authorization/auth.module';
import { QuestionsService } from '@api/src/questions/questions.service';
import { QuestionsRepository } from '@api/src/questions/questions.repository';

@Module({
  imports: [AuthModule],
  controllers: [QuestionController],
  providers: [QuestionsService, QuestionsRepository],
})
export class QuestionsModule {}
