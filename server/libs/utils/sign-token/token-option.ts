export const tokenOption = {
  accessToken: (jwtSecret) => {
    return {
      expiresIn: '1hr',
      secret: jwtSecret,
    };
  },
  refreshToken: (jwtSecret) => {
    return {
      expiresIn: '14d',
      secret: jwtSecret,
    };
  },
};
