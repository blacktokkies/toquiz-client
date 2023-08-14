export interface SuccessResponse<T = undefined> {
  statusCode: number;
  message?: string;
  result: T;
}

export interface ErrorResponse {
  code: string;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
