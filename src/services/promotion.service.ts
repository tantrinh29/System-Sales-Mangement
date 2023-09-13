import Http from "../helpers/http";

const http = new Http();

const fetchAllPromotions = async () => {
  try {
    const response = await http.get(`/promotion/getAllPromotions`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchPromotionBySlug = async (slug: any) => {
  try {
    const response = await http.get(`/promotion/getPromotionBySlug/${slug}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostPromotion = async (data: any) => {
  try {
    const response = await http.post("/promotion/addPromotion", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdatePromotion = async (slug: any, data: any) => {
  try {
    const response = await http.update(
      `/promotion/updatePromotion/${slug}`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeletePromotion = async (id: any) => {
  try {
    const response = await http.deleteOne(`/promotion/deletePromotion/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeletePromotionsAll = async () => {
  try {
    const response = await http.deleteOne(`/promotion/deletePromotionsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeletePromotionsByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(
      `/promotion/deletePromotionsByIds`,
      data
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const promotionService = {
  fetchAllPromotions,
  fetchPromotionBySlug,
  fetchPostPromotion,
  fetchUpdatePromotion,
  fetchDeletePromotion,
  fetchDeletePromotionsAll,
  fetchDeletePromotionsByIds,
};
