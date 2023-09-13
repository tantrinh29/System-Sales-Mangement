import Http from "../helpers/http";

const http = new Http();

const fetchAllPayments = async () => {
  try {
    const response = await http.get(`/payment/getAllPayments`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostPayment = async (data: any) => {
  try {
    const response = await http.post("/payment/addPayment", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdatePayment = async (id: any, data: any) => {
  try {
    const response = await http.update(`/payment/updatePayment/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeletePayment = async (id: any) => {
  try {
    const response = await http.deleteOne(`/payment/deletePayment/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeletePaymentsAll = async () => {
  try {
    const response = await http.deleteOne(`/payment/deletePaymentsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeletePaymentsByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/payment/deletePaymentsByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const paymentService = {
  fetchAllPayments,
  fetchPostPayment,
  fetchUpdatePayment,
  fetchDeletePayment,
  fetchDeletePaymentsAll,
  fetchDeletePaymentsByIds,
};
