import * as authHandlers from '@/mocks/handlers/auth';
import * as userHandlers from '@/mocks/handlers/user';

export const handlers = [
  ...Object.values(userHandlers),
  ...Object.values(authHandlers),
];
