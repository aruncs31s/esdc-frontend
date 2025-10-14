// Response types matching backend DTOs

// API Response Wrappers

export type { ApiMessageResponse, ApiErrorResponse, ApiSuccessResponse } from './api';

export type {
  UserData,
  LoginCredentials,
  UserRegisterData,
  UserRegisterDataByAdmin,
  UserDataForAdmin,
  RegisterRequest,
} from './user';

export type { DecodedToken, AuthResponse, AuthResult } from './auth';

export type {
  ProjectData,
  ContributorDetails,
  ProjectStatusType,
  TechnologyDetails,
  TagDetails,
} from './project';

export type { statsForAdmin } from './forAdmin';
