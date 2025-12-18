import axios from "axios";

const BASE_URL = "http://192.168.0.93:8111/api/chats";

export const getMessages = async (chatId) => {
  try {
    const res = await axios.get(`${BASE_URL}/${chatId}/messages`);
    return res.data;
  } catch (err) {
    console.error("getMessages error:", err);
    return [];
  }
};

export const sendMessage = async (chatId, messageData) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/${chatId}/messages`,
      messageData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.status === 200 || res.status === 201;
  } catch (err) {
    console.error("sendMessage error:", err);
    return false;
  }
};
