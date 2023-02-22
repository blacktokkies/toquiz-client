import type { SuccessResponse } from '../../response';
import type { User } from '../../../libs';

export interface RefreshResult {
  user: {
    id: User['id'];
    username: User['username'];
    nickname: User['nickname'];
    createdAt: User['createdAt'];
  };
  accessToken: string;
}

export type RefreshResponse = SuccessResponse<RefreshResult>;
