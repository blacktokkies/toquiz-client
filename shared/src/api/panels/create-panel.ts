import type { User } from '../../libs';
import type { SuccessResponse } from '../response';
import type { Panel } from '../../libs/domains/panel';

export interface CreatePanelBody {
  username: User['username'];
  password: User['password'];
}

export interface CreatePanelResult {
  panel: Panel;
}

export type CreatePanelResponse = SuccessResponse<CreatePanelResult>;
