import {
  AuthenticatedUser,
  LoginResponse,
  RefreshTokenResponse,
  Response,
} from "../../types";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOAD_CURRENT_LOGIN_USER_REQUEST =
  "LOAD_CURRENT_LOGIN_USER_REQUEST";
export const LOAD_CURRENT_LOGIN_USER_SUCCESS =
  "LOAD_CURRENT_LOGIN_USER_SUCCESS";
export const LOAD_CURRENT_LOGIN_USER_FAILED = "LOAD_CURRENT_LOGIN_USER_FAILED";
export const LOGIN_FAILED = "LOGIN_FAILED";

export const REFRESH_TOKEN_REQUEST = "REFRESH_TOKEN_REQUEST";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const REFRESH_TOKEN_FAILED = "REFRESH_TOKEN_FAILED";

export const LOGOUT = "LOGOUT";

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  payload: {
    email: string;
    password: string;
  };
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: LoginResponse;
}

export interface LoadCurrentLoginUserRequest {
  type: typeof LOAD_CURRENT_LOGIN_USER_REQUEST;
}

export interface LoadCurrentLoginUserSuccess {
  type: typeof LOAD_CURRENT_LOGIN_USER_SUCCESS;
  payload: AuthenticatedUser;
}

export interface LoadCurrentLoginUserFailed {
  type: typeof LOAD_CURRENT_LOGIN_USER_FAILED;
  payload: Response;
}

export interface LoginFailedAction {
  type: typeof LOGIN_FAILED;
  payload: Response;
}

interface RefreshTokenSuccess {
  type: typeof REFRESH_TOKEN_SUCCESS;
  payload: RefreshTokenResponse;
}

interface RefreshTokenFailed {
  type: typeof REFRESH_TOKEN_FAILED;
  payload: Response;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoadCurrentLoginUserRequest
  | LoadCurrentLoginUserSuccess
  | LoadCurrentLoginUserFailed
  | LoginFailedAction
  | RefreshTokenSuccess
  | RefreshTokenFailed
  | LogoutAction;
