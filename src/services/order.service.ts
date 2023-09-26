import Http from "../helpers/http";

const http = new Http();

const fetchAllOrders = async () => {
  try {
    const response = await http.get(`/order/getAllOrders`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchOrderByID = async (id: any) => {
  try {
    const response = await http.get(`/order/getOrderById/${id}`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchOrderByAssignedToID = async (id: any) => {
  console.log(id)
  try {
    const response = await http.get(`/order/getOrderByAssignedToID/${id}`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdateOrder = async (id: any, data: any) => {
  try {
    const response = await http.update(`/order/updateOrder/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteOrder = async (id: any) => {
  try {
    const response = await http.deleteOne(`/order/deleteOrder/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteOrdersAll = async () => {
  try {
    const response = await http.deleteOne(`/order/deleteOrdersAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteOrdersByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/order/deleteOrdersByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const orderService = {
  fetchAllOrders,
  fetchOrderByID,
  fetchOrderByAssignedToID,
  fetchUpdateOrder,
  fetchDeleteOrder,
  fetchDeleteOrdersAll,
  fetchDeleteOrdersByIds,
};
