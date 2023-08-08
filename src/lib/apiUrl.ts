const auth = {
  signup: () => `/api/auth/signup`,
  login: () => `/api/auth/login`,
  logout: () => `/api/auth/logout`,
  signout: () => `/api/auth/signout`,
  update: () => `/api/auth/update`,
  refresh: () => `/api/auth/refresh`,
  me: () => `/api/auth/me`,
} as const;

const panelApiUrl = {
  getMyPanels: () => `/api/panels` as const,
};

export const apiUrl = {
  auth,
  panel: panelApiUrl,
};
