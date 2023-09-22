import Http from "../helpers/http";

const http = new Http();

const fetchAllBanners = async () => {
  try {
    const response = await http.get(`/banner/getAllBanners`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};


const fetchPostBanner = async (data: any) => {
  try {
    const response = await http.post("/banner/addBanner", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdateBanner = async (id: any, data: any) => {
  try {
    const response = await http.update(`/banner/updateBanner/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBanner = async (id: any) => {
  try {
    const response = await http.deleteOne(`/banner/deleteBanner/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBannersAll = async () => {
  try {
    const response = await http.deleteOne(`/banner/deleteBannersAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBannersByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/banner/deleteBannersByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const bannerService = {
  fetchAllBanners,
  fetchPostBanner,
  fetchUpdateBanner,
  fetchDeleteBanner,
  fetchDeleteBannersAll,
  fetchDeleteBannersByIds,
};
