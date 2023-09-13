import Http from "../helpers/http";

const http = new Http();
const login = async (email: string, password: string) => {
  const body = { email, password };
  return await http.post("/auth/login", body).then((response: any) => {
    return response;
  });
};

export const authService = {
  login,
};
