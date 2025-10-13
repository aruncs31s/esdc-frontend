

// User related types and interfaces

// [UserData] Is used to type the local_data stored in the browser for persisting user session
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
  confirmPassword?: string;
  github_username?: string;
}


export interface UserRegisterDataByAdmin {
  name: string;
  username: string;
  email: string;
  role: string;
  github_username?: string;
  password?: string;
  confirmPassword?: string;
  status?: string;
}

export interface UserDataForAdmin {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  github_username?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}