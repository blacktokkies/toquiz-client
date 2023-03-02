/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
let _accessToken = '';

export const setToken = (token: string): void => {
  _accessToken = token;
};
export const clearToken = (): void => {
  _accessToken = '';
};
