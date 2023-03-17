import type { SuccessResponse } from '../../response';
import type { User } from '../../../libs';

export interface GetUserInfoResult {
  id: User['id'];
  username: User['username'];
  nickname: User['nickname'];
  provider: User['provider'];
  createdAt: User['createdAt'];
  updatedAt: User['updatedAt'];
  deletedAt: User['deletedAt'];
}

export type GetUserInfoResponse = SuccessResponse<GetUserInfoResult>;
