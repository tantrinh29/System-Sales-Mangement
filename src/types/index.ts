export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: any;
  password: string;
}

export interface Notification {
  status: boolean;
  message: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  refreshToken: string;
  accessToken?: string;
}

export interface RefreshTokenResponse {
  status: boolean;
  message: string;
  refreshToken: string;
  accessToken?: string;
}

export interface Response {
  status: boolean;
  message: string;
}

export interface INotification {
  id: string;
  message: string;
  date: number;
  read: boolean;
}
