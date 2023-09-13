import Http from "../helpers/http";

const http = new Http();

const fetchAllComments = async () => {
  try {
    const response = await http.get(`/comment/getAllComments`);
    return response.result;
  } catch (error) {
    console.error(error);
  }
};


const fetchDeleteComment = async (id: any) => {
  try {
    const response = await http.deleteOne(`/comment/deleteComment/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCommentsAll = async () => {
  try {
    const response = await http.deleteOne(`/comment/deleteCommentsAll`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDeleteCommentsByIds = async (data: any) => {
  try {
    const response = await http.deleteAll(`/comment/deleteCommentsByIds`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const commentService = {
  fetchAllComments,
  fetchDeleteComment,
  fetchDeleteCommentsAll,
  fetchDeleteCommentsByIds,
};
