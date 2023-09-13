import Http from "../helpers/http";

const http = new Http();

const fetchAllBlogs = async () => {
  try {
    const response = await http.get(`/blog/getAllBlogs`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};

const fetchBlogBySlug = async (slug: any) => {
  try {
    const response = await http.get(`/blog/getBlogBySlug/${slug}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchPostBlog = async (data: any) => {
  try {
    const response = await http.post("/blog/addBlog", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchUpdateBlog = async (slug: any, data: any) => {
  try {
    const response = await http.update(`/blog/updateBlog/${slug}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBlog = async (id: any) => {
  try {
    const response = await http.deleteOne(`/blog/deleteBlog/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBlogsAll = async () => {
  try {
    const response = await http.deleteOne(`/blog/deleteBlogsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteBlogsByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/blog/deleteBlogsByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const blogService = {
  fetchAllBlogs,
  fetchBlogBySlug,
  fetchPostBlog,
  fetchUpdateBlog,
  fetchDeleteBlog,
  fetchDeleteBlogsAll,
  fetchDeleteBlogsByIds,
};
