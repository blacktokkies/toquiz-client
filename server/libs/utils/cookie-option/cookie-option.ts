export const cookieOption = {
  refreshToken: {
    path: '/api/users/auth/refresh',
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14일 동안 유지
  },
  toquizToken: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1년 동안 유지
  },
};
