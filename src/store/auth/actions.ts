import { ThunkAction } from "redux-thunk";
import { authService } from "../../services/auth.service";
import {
  AuthActionTypes,
  LOAD_CURRENT_LOGIN_USER_FAILED,
  LOAD_CURRENT_LOGIN_USER_SUCCESS,
  LOGIN_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "./types";
import { AppState } from "..";
import { verifyToken } from "../../helpers/verifyToken";
import { userService } from "../../services/user.service";

export const login = (
  data: any
): ThunkAction<void, AppState, null, AuthActionTypes> => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
      payload: {
        email: data.email,
        password: data.password,
      },
    });

    try {
      const response = await authService.login(data.email, data.password);
      if (response.status === true) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: response.result,
        });
        let user: any = await verifyToken(response.result.accessToken);
        
        if (user.role === "ADMIN" && user.verify == 1) {
          const info = await userService.fetchUserByID();
          try {
            dispatch({
              type: LOAD_CURRENT_LOGIN_USER_SUCCESS,
              payload: info.result,
            });
            return {
              status: true,
              message: "Đăng Nhập Thành Công!",
            };
          } catch (userError: any) {
            dispatch({
              type: LOAD_CURRENT_LOGIN_USER_FAILED,
              payload: {
                status: false,
                message: userError.message,
              },
            });
          }
        } else {
          return {
            status: false,
            message: "Không Đủ Quyền Truy Cập Hoặc Chưa Xác Thực Tài Khoản",
          };
        }
      } else {
        dispatch({
          type: LOGIN_FAILED,
          payload: response.message,
        });
        return {
          status: false,
          message: response.message,
        };
      }
    } catch (error: any) {
      dispatch({
        type: LOGIN_FAILED,
        payload: {
          status: false,
          message: error.message,
        },
      });
    }
  };
};

export const logout = (): AuthActionTypes => {
  return { type: LOGOUT };
};
