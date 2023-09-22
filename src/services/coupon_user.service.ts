import Http from "../helpers/http";

const http = new Http();

const fetchAllCouponUsers = async () => {
  try {
    const response = await http.get(`/coupon-user/getAllCouponUsers`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostCouponUser = async (data: any) => {
  try {
    const response = await http.post("/coupon-user/addCouponUser", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCouponUser = async (id: any) => {
  try {
    const response = await http.deleteOne(`/coupon-user/deleteCouponUser/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCouponUsersAll = async () => {
  try {
    const response = await http.deleteOne(`/coupon-user/deleteCouponUsersAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCouponUsersByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/coupon-user/deleteCouponUsersByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const couponUserService = {
  fetchAllCouponUsers,
  fetchPostCouponUser,
  fetchDeleteCouponUser,
  fetchDeleteCouponUsersAll,
  fetchDeleteCouponUsersByIds,
};
