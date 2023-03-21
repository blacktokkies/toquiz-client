import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Question } from 'shared';

export class LikeQuestionDto {
  @IsString()
  @IsNotEmpty()
  panelId: Question['panelId'];

  @IsString()
  @IsNotEmpty()
  questionId: Question['id'];

  @IsString()
  @IsNotEmpty()
  toquizUserId: Question['toquizUserId'];

  @IsBoolean()
  @IsNotEmpty()
  like: boolean;
}
