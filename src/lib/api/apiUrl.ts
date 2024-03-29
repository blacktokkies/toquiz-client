import type { Panel } from '@/lib/api/panel';

const auth = {
  signup: () => `/api/auth/signup`,
  login: () => `/api/auth/login`,
  logout: () => `/api/auth/logout`,
  refresh: () => `/api/auth/refresh`,
  me: () => `/api/members/me`,
  update: () => `/api/members/me`,
  resign: () => `/api/auth/resign`,
} as const;

const panel = {
  create: () => `/api/panel`,
  get: (panelId: Panel['sid']) => `/api/panels/${panelId}`,
  update: (panelId: Panel['sid']) => `/api/panels/${panelId}`,
  delete: (panelId: Panel['sid']) => `/api/panels/${panelId}`,
  getMyPanels: () => `/api/panels`,
} as const;

const question = {
  getQuestions: (panelId: Panel['sid']) =>
    `/api/panels/${panelId}/questions` as const,
  create: (panelId: Panel['sid']) => `/api/panels/${panelId}/question`,
  like: (questionId: string) => `/api/questions/${questionId}/like` as const,
} as const;
const answer = {
  getAnswers: (questionId: string) =>
    `/api/questions/${questionId}/answers` as const,
  create: (questionId: string) =>
    `/api/questions/${questionId}/answer` as const,
};
const activeInfo = {
  get: (panelId: Panel['sid']) => `/api/panels/${panelId}/active-info` as const,
};

export const apiUrl = {
  auth,
  panel,
  question,
  activeInfo,
  answer,
} as const;
