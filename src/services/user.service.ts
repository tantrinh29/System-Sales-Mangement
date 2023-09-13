import Http from "../helpers/http";

const http = new Http();

const fetchAllUsers = async () => {
  try {
    const response = await http.get(`/auth/meAll`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchUserByID = async () => {
  try {
    const response = await http.get(`/auth/me`);
    return response;
  } catch (error) {
    console.error(error);
  }
};



const fetchUpdateUser = async (id: any, data: any) => {
  try {
    const response = await http.update(`/auth/updateUserByID/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};


const fetchDeleteUser = async (id: any) => {
  try {
    const response = await http.deleteOne(`/auth/deleteUser/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};



export const userService = {
  fetchAllUsers,
  fetchUserByID,
  fetchUpdateUser,
  fetchDeleteUser
};
