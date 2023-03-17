import type { SuccessResponse } from '../../response';

export interface IssueToquizTokenResult {
  message: string;
}

export type IssueToquizTokenResponse = SuccessResponse<IssueToquizTokenResult>;
