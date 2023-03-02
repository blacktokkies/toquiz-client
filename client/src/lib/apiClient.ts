/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
let _accessToken = '';

export const setToken = (token: string): void => {
  _accessToken = token;
};
export const clearToken = (): void => {
  _accessToken = '';
};

export class ApiError extends Error {
  constructor(public response: Response, public data: any = undefined) {
    super(`status ${response.status}: Failed to fetch`);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: Promise<T> = response.json();
  if (response.ok) return data;
  return Promise.reject(new ApiError(response, data));
}

export async function request<T>(
  method: string,
  url: string,
  options: RequestInit | undefined = {},
): Promise<T> {
  const response = await fetch(url, { method, ...options });
  return handleResponse(response);
}
