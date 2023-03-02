/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
let _accessToken = '';

export const setAccessToken = (token: string): void => {
  _accessToken = token;
};
export const clearAccessToken = (): void => {
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

export const apiClient = {
  async get<T>(url: string, headers: HeadersInit | undefined = {}): Promise<T> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...headers,
    };
    const data = request<T>('GET', url, { headers: _headers });
    return data;
  },
  async post<T>(
    url: string,
    body: Record<string, any> | undefined = undefined,
    headers: HeadersInit | undefined = {},
  ): Promise<T> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };
    const _body = body && JSON.stringify(body);
    const data: Promise<T> = request('POST', url, {
      headers: _headers,
      body: _body,
    });
    return data;
  },
  async delete<T>(
    url: string,
    headers: HeadersInit | undefined = {},
  ): Promise<T> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...headers,
    };
    const data = request<T>('DELETE', url, { headers: _headers });
    return data;
  },
  async patch<T>(
    url: string,
    body: Record<string, any> | undefined = undefined,
    headers: HeadersInit | undefined = {},
  ): Promise<T> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };
    const _body = body && JSON.stringify(body);
    const data: Promise<T> = request('PATCH', url, {
      headers: _headers,
      body: _body,
    });
    return data;
  },
  async put<T>(
    url: string,
    body: Record<string, any> | undefined = undefined,
    headers: HeadersInit | undefined = {},
  ): Promise<T> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };
    const _body = body && JSON.stringify(body);
    const data: Promise<T> = request('PUT', url, {
      headers: _headers,
      body: _body,
    });
    return data;
  },
};
