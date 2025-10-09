// Response types matching backend DTOs

// API Response Wrappers
export interface ApiSuccessResponse<T> {
  status: true;
  data: T;
  meta: string;
}

export interface ApiErrorResponse {
  status: false;
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


export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
    verified?: boolean | null;
    status?: string;
    createdAt?: number;
    updatedAt?: number;
}

export default User;



export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
	  name: string;
    username: string;
    email: string;
    github_username: string;
    password: string;
    confirmPassword?: string;
}
  