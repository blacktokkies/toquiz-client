const authApiUrl = {
  signup: () => `/api/users/auth/signup` as const,
  login: () => `/api/users/auth/login` as const,
  me: () => `/api/user` as const,
  refresh: () => `/api/users/auth/refresh` as const,
};

const panelApiUrl = {
  getMyPanels: () => `/api/panels` as const,
};

export const apiUrl = {
  auth: authApiUrl,
  panel: panelApiUrl,
};
