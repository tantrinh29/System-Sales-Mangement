import Http from "../helpers/http";

const http = new Http();

const fetchAllChats = async () => {
    try {
        const response = await http.get(`/chat/getAllChats`);
        return response.result;
    } catch (error) {
        console.error(error);
    }
};

export const chatService = {
    fetchAllChats,
};
