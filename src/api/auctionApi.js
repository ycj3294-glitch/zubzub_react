import axios from "axios";

const BASE_URL = "http://192.168.0.93:8111/api/auctions";

export const getAuction = async (auctionId) => {
  try {
    const res = await axios.get(`${BASE_URL}/${auctionId}`);
    return res.data;
  } catch (err) {
    console.error("getAuction error:", err);
    return null;
  }
};

export const createAuction = async (auctionFormData) => {
  try {
    const res = await axios.post(`${BASE_URL}`, auctionFormData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.status === 200 || res.status === 201;
  } catch (err) {
    console.error("createAuction error:", err);
    return false;
  }
};

export const createBid = async (auctionId, bidFormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/${auctionId}/bids`, bidFormData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.status === 200 || res.status === 201;
  } catch (err) {
    console.error("createBid error:", err);
    return false;
  }
};
