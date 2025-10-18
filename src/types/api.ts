export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: string;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: number;
    status: string;
    message: string;
    details: string;
  };
}

export interface ApiMessageResponse {
  message: string;
}
