export interface SuccessResponse<T> {
  statusCode: number;
  result: T;
}

export interface ErrorResponse {
  code: string;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
