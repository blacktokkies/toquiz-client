import type { User, Panel } from '../../libs';
import type { SuccessResponse } from '../response';

export interface CreatePanelBody {
  username: User['username'];
  password: User['password'];
}

export interface CreatePanelResult {
  panel: Panel;
}

export type CreatePanelResponse = SuccessResponse<CreatePanelResult>;
