import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Question } from 'shared';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  panelId: Question['panelId'];

  @IsString()
  @IsNotEmpty()
  toquizUserId: Question['toquizUserId'];

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: Question['content'];
}
