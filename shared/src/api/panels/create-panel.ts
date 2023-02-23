import type { Panel } from '../../libs';
import type { SuccessResponse } from '../response';

export interface CreatePanelBody {
  title: Panel['title'];
  description: Panel['title'];
}

export interface CreatePanelResult {
  panel: Panel;
}

export type CreatePanelResponse = SuccessResponse<CreatePanelResult>;
