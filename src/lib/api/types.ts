export type SuccessResponse<T = undefined> = T extends undefined
  ? {
      statusCode: number;
      message?: string;
    }
  : {
      statusCode: number;
      message?: string;
      result: T;
    };

export interface ErrorResponse {
  code: string;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
