import Http from "./http";

export const setAuthToken = (accessToken: string): void => {
  const httpInstance = Http.getInstance();

  if (accessToken) {
    httpInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  } else {
    delete httpInstance.defaults.headers.common["Authorization"];
  }
};
