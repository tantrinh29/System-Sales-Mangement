import Http from "../helpers/http";

const http = new Http();

const fetchAllBrands = async () => {
  try {
    const response = await http.get(`/brand/getAllBrands`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchBrandBySlug = async (slug: any) => {
  try {
    const response = await http.get(`/brand/getBrandBySlug/${slug}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostBrand = async (data: any) => {
  try {
    const response = await http.post("/brand/addBrand", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdateBrand = async (slug: any, data: any) => {
  try {
    const response = await http.update(`/brand/updateBrand/${slug}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBrand = async (id: any) => {
  try {
    const response = await http.deleteOne(`/brand/deleteBrand/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBrandsAll = async () => {
  try {
    const response = await http.deleteOne(`/brand/deleteBrandsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBrandsByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/brand/deleteBrandsByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const brandService = {
  fetchAllBrands,
  fetchBrandBySlug,
  fetchPostBrand,
  fetchUpdateBrand,
  fetchDeleteBrand,
  fetchDeleteBrandsAll,
  fetchDeleteBrandsByIds,
};
