import type { Panel } from '@/lib/api/panel';

const auth = {
  signup: () => `/api/auth/signup`,
  login: () => `/api/auth/login`,
  logout: () => `/api/auth/logout`,
  refresh: () => `/api/auth/refresh`,
  me: () => `/api/members/me`,
} as const;

const panel = {
  create: () => `/api/panel`,
  get: (panelId: Panel['sid']) => `/api/panels/${panelId}`,
  update: (panelId: Panel['sid']) => `/api/panels/${panelId}`,
  delete: (panelId: Panel['sid']) => `/api/panels/${panelId}`,
  getMyPanels: () => `/api/panels`,
  getMyActiveInfo: (panelId: Panel['sid']) =>
    `/api/panels/${panelId}/active-info` as const,
} as const;

const question = {
  getQuestions: (panelId: Panel['sid']) =>
    `/api/panels/${panelId}/questions` as const,
  create: (panelId: Panel['sid']) => `/api/panels/${panelId}/question`,
  like: (questionId: string) => `/api/questions/${questionId}/like` as const,
} as const;

export const apiUrl = {
  auth,
  panel,
  question,
} as const;
