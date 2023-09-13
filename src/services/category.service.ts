import Http from "../helpers/http";

const http = new Http();

const fetchAllCategories = async () => {
  try {
    const response = await http.get(`/category/getAllCategories`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchCategoryBySlug = async (slug: any) => {
  try {
    const response = await http.get(`/category/getCategoryBySlug/${slug}`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostCategory = async (data: any) => {
  try {
    const response = await http.post("/category/addCategory", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdateCategory = async (slug: any, data: any) => {
  try {
    const response = await http.update(
      `/category/updateCategory/${slug}`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCategory = async (id: any) => {
  try {
    const response = await http.deleteOne(`/category/deleteCategory/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCategoriesAll = async () => {
  try {
    const response = await http.deleteOne(`/category/deleteCategoriesAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCategoriesByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(
      `/category//deleteCategoriesByIds`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const categoryService = {
  fetchAllCategories,
  fetchCategoryBySlug,
  fetchPostCategory,
  fetchUpdateCategory,
  fetchDeleteCategory,
  fetchDeleteCategoriesAll,
  fetchDeleteCategoriesByIds,
};
