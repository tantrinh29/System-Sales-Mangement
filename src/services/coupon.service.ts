import Http from "../helpers/http";

const http = new Http();

const fetchAllCoupons = async () => {
  try {
    const response = await http.get(`/coupon/getAllCoupons`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostCoupon = async (data: any) => {
  try {
    const response = await http.post("/coupon/addCoupon", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdateCoupon = async (id: any, data: any) => {
  try {
    const response = await http.update(`/coupon/updateCoupon/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCoupon = async (id: any) => {
  try {
    const response = await http.deleteOne(`/coupon/deleteCoupon/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCouponsAll = async () => {
  try {
    const response = await http.deleteOne(`/coupon/deleteCouponsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCouponsByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/coupon/deleteCouponsByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const couponService = {
  fetchAllCoupons,
  fetchPostCoupon,
  fetchUpdateCoupon,
  fetchDeleteCoupon,
  fetchDeleteCouponsAll,
  fetchDeleteCouponsByIds,
};
