import axios from "axios";

const BASE_URL = "http://192.168.0.93:8111/api/chats";

export const getMessages = async (chatId) => {
  const res = await axios.get(`${BASE_URL}/${chatId}/messages`);
  return res.data;
};

export const sendMessage = async (chatId, messageData) => {
  const res = await axios.post(`${BASE_URL}/${chatId}/messages`, messageData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.ok;
};
