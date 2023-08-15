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

export const apiUrl = {
  auth,
  panel,
} as const;