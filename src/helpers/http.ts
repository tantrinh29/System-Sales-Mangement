import axios, { AxiosInstance } from "axios";
import { store } from "../store";
import { history } from "./history";
import { URL_CONSTANTS } from "../constants/url.constants";
import { CUSTOM_ENV } from "../utils/custom.env";
import { REFRESH_TOKEN_SUCCESS } from "../store/auth/types";

class Http {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: `${CUSTOM_ENV.API_URL}`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use((config) => {
      const accessToken = store.getState().auth.accessToken;
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (res) => res,
      async (err) => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          const originalRequest = err.config;
          const refreshToken = store.getState().auth.refreshToken;
          console.log(refreshToken);
          //authorization.
          if (
            err.response.data.errors.authorization.msg.message ===
            "jwt expired" &&
            err.response.data.errors.authorization.msg.status === 402
          ) {
            if (refreshToken) {
              try {
                const response = await this.instance.post(
                  "/auth/refresh-token",
                  {
                    refreshToken: refreshToken,
                  }
                );
                store.dispatch({
                  type: REFRESH_TOKEN_SUCCESS,
                  payload: {
                    accessToken: response.data.result.accessToken,
                    refreshToken: response.data.result.refreshToken,
                  },
                });
                this.instance.defaults.headers.common["Authorization"] =
                  response.data.result.accessToken;
                originalRequest.headers["Authorization"] =
                  response.data.result.accessToken;

                return this.instance(originalRequest);
              } catch (error) {
                history.push(URL_CONSTANTS.LOGIN);
              }
            } else {
              console.log("Refresh token not available.");
              history.push(URL_CONSTANTS.LOGIN);
            }
          }
        }
        return Promise.reject(err);
      }
    );
  }

  static getInstance() {
    const http = new Http();
    return http.instance;
  }

  public async get(url: string, params?: any): Promise<any> {
    try {
      const response = await this.instance.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make GET request.");
    }
  }

  public async post(url: string, data: any): Promise<any> {
    try {
      const response = await this.instance.post(url, data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make POST request.");
    }
  }

  public async update(url: string, data: any): Promise<any> {
    try {
      const response = await this.instance.put(url, data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make PUT request.");
    }
  }

  public async patch(url: string, data: any): Promise<any> {
    try {
      const response = await this.instance.patch(url, data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make PATCH request.");
    }
  }

  public async deleteOne(url: string): Promise<any> {
    try {
      const response = await this.instance.delete(url);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make DELETE ONE request.");
    }
  }

  public async deleteAll(url: string, data: any): Promise<any> {
    try {
      const response = await this.instance.delete(url, { data });
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to make DELETE ALL request.");
    }
  }
}

export default Http;
