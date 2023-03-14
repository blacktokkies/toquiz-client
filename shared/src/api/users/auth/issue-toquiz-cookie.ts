import type { SuccessResponse } from '../../response';

export interface IssueToquizCookieResult {
  message: string;
}

export type IssueToquizCookieResponse =
  SuccessResponse<IssueToquizCookieResult>;
