import type { Panel } from '../../libs';
import type { SuccessResponse } from '../response';

export interface GetPanelResult extends Panel {}

export type GetPanelResponse = SuccessResponse<GetPanelResult>;
