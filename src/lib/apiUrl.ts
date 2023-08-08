const auth = {
  signup: () => `/api/auth/signup`,
  login: () => `/api/auth/login`,
  logout: () => `/api/auth/logout`,
  update: () => `/api/auth/update`,
  signout: () => `/api/auth/signout`,
  refresh: () => `/api/auth/refresh`,
  me: () => `/api/auth/me`,
} as const;

const panel = {
  create: () => `/api/panel`,
  get: (panelId: string) => `/api/panels/${panelId}`,
  update: (panelId: string) => `/api/panels/${panelId}`,
  delete: (panelId: string) => `/api/panels/${panelId}`,
  getMyPanels: () => `/api/members/me/panels`,
} as const;

export const apiUrl = {
  auth,
  panel,
} as const;
