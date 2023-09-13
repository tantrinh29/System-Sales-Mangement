import Http from "../helpers/http";

const http = new Http();

const fetchAllProducts = async () => {
  try {
    const response = await http.get(`/product/getAllProducts`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchProductBySlug = async (slug: any) => {
  try {
    const response = await http.get(`/product/getProductBySlug/${slug}`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostProduct = async (data: any) => {
  try {
    const response = await http.post("/product/addProduct", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdateProduct = async (slug: any, isEdit: any, data: any) => {
  try {
    const response = await http.update(
      `/product/updateProduct/${slug}?isEdit=${isEdit}`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteProduct = async (id: any) => {
  try {
    const response = await http.deleteOne(`/product/deleteProduct/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteProductesAll = async () => {
  try {
    const response = await http.deleteOne(`/product/deleteProductsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteProductsByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/product/deleteProductsByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const productService = {
  fetchAllProducts,
  fetchProductBySlug,
  fetchPostProduct,
  fetchUpdateProduct,
  fetchDeleteProduct,
  fetchDeleteProductesAll,
  fetchDeleteProductsByIds,
};
