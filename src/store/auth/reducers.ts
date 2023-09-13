import { AuthenticatedUser } from "../../types";
import {
  AuthActionTypes,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  LOAD_CURRENT_LOGIN_USER_SUCCESS,
  LOAD_CURRENT_LOGIN_USER_FAILED,
  LOAD_CURRENT_LOGIN_USER_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILED,
} from "./types";

export interface AuthState {
  user: AuthenticatedUser | null;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  error: any | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  accessToken: null,
  refreshToken: null,
  error: null,
};

const authReducer = (
  state: AuthState = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST: {
      return { ...state, loading: true };
    }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        accessToken: action.payload.accessToken || null,
        refreshToken: action.payload.refreshToken || null,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        accessToken: null,
        refreshToken: null,
        error: action.payload,
      };
    case LOAD_CURRENT_LOGIN_USER_REQUEST: {
      return { ...state, loading: true };
    }
    case LOAD_CURRENT_LOGIN_USER_SUCCESS: {
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    }
    case LOAD_CURRENT_LOGIN_USER_FAILED: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    case REFRESH_TOKEN_SUCCESS: {
      return {
        ...state,
        loading: false,
        accessToken: action.payload.accessToken || null,
        refreshToken: action.payload.refreshToken || null,
        error: null,
      };
    }
    case REFRESH_TOKEN_FAILED: {
      return {
        ...state,
        loading: false,
        accessToken: null,
        refreshToken: null,
        error: action.payload,
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
