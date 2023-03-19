import type { Question } from '../../libs';
import type { SuccessResponse } from '../response';

export interface CreateQuestionBody {
  content: Question['content'];
}

export interface CreateQuestionResult extends Question {}

export type CreateQuestionResponse = SuccessResponse<CreateQuestionResult>;
