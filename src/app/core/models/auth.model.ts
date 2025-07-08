export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface JwtPayload {
  email: string;
  name: string;
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export enum UserRole {
  ADMIN = 'admin',
  REGULAR = 'regular'
}