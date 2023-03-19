import type { Question } from '../../libs';
import type { SuccessResponse } from '../response';

export interface GetPanelQuestionsResult {
  nextCursor?: Question['id'];
  questions: Question[];
}

export type GetPanelQuestionsResponse =
  SuccessResponse<GetPanelQuestionsResult>;
