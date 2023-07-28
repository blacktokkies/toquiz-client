import * as authHandlers from '@/mocks/handlers/auth';
import * as panelHandlers from '@/mocks/handlers/panel';

export const handlers = [
  ...Object.values(authHandlers),
  ...Object.values(panelHandlers),
];
