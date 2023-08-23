const auth = {
  signup: () => `/api/auth/signup`,
  login: () => `/api/auth/login`,
  logout: () => `/api/auth/logout`,
  refresh: () => `/api/auth/refresh`,
  me: () => `/api/members/me`,
} as const;

const panel = {
  create: () => `/api/panel`,
  get: (panelId: string) => `/api/panels/${panelId}`,
  update: (panelId: string) => `/api/panels/${panelId}`,
  delete: (panelId: string) => `/api/panels/${panelId}`,
  getMyPanels: () => `/api/panels`,
} as const;

const question = {
  getQuestions: (panelId: string) =>
    `/api/panels/${panelId}/questions` as const,
  create: (panelId: string) => `/api/panels/${panelId}/question`,
} as const;

export const apiUrl = {
  auth,
  panel,
  question,
} as const;
