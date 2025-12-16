import axios from "axios";

const BASE_URL = "http://192.168.0.93:8111/api/auctions";

export const getAuction = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createAuction = async (auctionFormData) => {
  const res = await axios.post(`${BASE_URL}`, auctionFormData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const createBid = async (auctionId, bidFormData) => {
  const res = await axios.post(`${BASE_URL}/${auctionId}/bids`, bidFormData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
