import * as authHandlers from '@/mocks/handlers/auth';
import * as panelHandlers from '@/mocks/handlers/panel';
import * as questionHandlers from '@/mocks/handlers/question';

export const handlers = [
  ...Object.values(authHandlers),
  ...Object.values(panelHandlers),
  ...Object.values(questionHandlers),
];
