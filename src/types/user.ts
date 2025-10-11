// Ty
export interface UserData {
  id?: string;
  email: string;
  username: string;
  role: string;
  name?: string;
  login?: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  bio?: string;
  html_url?: string;
  created_at?: string;
  createdAt?: string;
  location?: string;
  company?: string;
  blog?: string;
  github_username?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface UserRegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  github_username?: string;
}