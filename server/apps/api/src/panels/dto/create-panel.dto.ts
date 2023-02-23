import { Panel } from 'shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePanelDto {
  @IsString()
  @IsNotEmpty()
  userId: Panel['id'];

  @IsString()
  @IsNotEmpty()
  title: Panel['title'];

  @IsString()
  description: Panel['description'];
}
