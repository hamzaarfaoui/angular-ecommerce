export interface LoginRequest {
  username?: string; // Django utilise souvent le username ou l'email selon ta config
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface UserProfile {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
}

export interface DjangoApiErrorResponse {
  [key: string]: string[] | string;
}