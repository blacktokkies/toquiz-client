import isNode from 'detect-node';

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

/**
 * ### Ajax 요청할 BASE_URL
 * 환경 변수 `VITE_API_BASE_URL`의 값을 기본으로 한다.
 * 설정되어있지 않은 경우, 브라우저 환경일 때는 상대 경로를 사용하고
 * 그 외의 런타임은 임의의 origin을 사용한다.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (isNode ? 'http://localhost' : '');

type DefaultQueryParams =
  | string
  | Record<string, string>
  | string[][]
  | URLSearchParams
  | undefined;

export const apiClient = {
  async get<
    ResponseBody,
    QueryParams extends DefaultQueryParams = DefaultQueryParams,
  >(
    url: string,
    queryParams?: QueryParams,
    headers: HeadersInit | undefined = {},
  ): Promise<ResponseBody> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...headers,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const data = request<ResponseBody>(
      'GET',
      `${API_BASE_URL}${url}${queryString}`,
      {
        headers: _headers,
      },
    );
    return data;
  },

  async post<
    ResponseBody,
    RequestBody = undefined,
    QueryParams extends DefaultQueryParams = DefaultQueryParams,
  >(
    url: string,
    body: RequestBody | undefined = undefined,
    queryParams?: QueryParams,
    headers: HeadersInit | undefined = {},
  ): Promise<ResponseBody> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };
    const _body = body && JSON.stringify(body);
    const queryString = new URLSearchParams(queryParams).toString();
    const data: Promise<ResponseBody> = request(
      'POST',
      `${API_BASE_URL}${url}${queryString}`,
      {
        headers: _headers,
        body: _body,
      },
    );
    return data;
  },

  async delete<
    ResponseBody,
    QueryParams extends DefaultQueryParams = DefaultQueryParams,
  >(
    url: string,
    queryParams?: QueryParams,
    headers: HeadersInit | undefined = {},
  ): Promise<ResponseBody> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...headers,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const data = request<ResponseBody>(
      'DELETE',
      `${API_BASE_URL}${url}${queryString}`,
      {
        headers: _headers,
      },
    );
    return data;
  },

  async patch<
    ResponseBody,
    RequestBody = undefined,
    QueryParams extends DefaultQueryParams = DefaultQueryParams,
  >(
    url: string,
    body: RequestBody | undefined = undefined,
    queryParams?: QueryParams,
    headers: HeadersInit | undefined = {},
  ): Promise<ResponseBody> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };
    const _body = body && JSON.stringify(body);
    const queryString = new URLSearchParams(queryParams).toString();
    const data: Promise<ResponseBody> = request(
      'PATCH',
      `${API_BASE_URL}${url}${queryString}`,
      {
        headers: _headers,
        body: _body,
      },
    );
    return data;
  },

  async put<
    ResponseBody,
    RequestBody = undefined,
    QueryParams extends DefaultQueryParams = DefaultQueryParams,
  >(
    url: string,
    body: RequestBody | undefined = undefined,
    queryParams?: QueryParams,
    headers: HeadersInit | undefined = {},
  ): Promise<ResponseBody> {
    const _headers: HeadersInit = {
      Authorization: `Bearer ${_accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };
    const _body = body && JSON.stringify(body);
    const queryString = new URLSearchParams(queryParams).toString();
    const data: Promise<ResponseBody> = request(
      'PUT',
      `${API_BASE_URL}${url}${queryString}`,
      {
        headers: _headers,
        body: _body,
      },
    );
    return data;
  },
} as const;
