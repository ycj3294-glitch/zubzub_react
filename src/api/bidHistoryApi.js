import axios from "axios";

const BASE_URL = "http://localhost:8111/api/bid-histories";

export const loadBidHistories = async (auctionId, page, size = 20) => {
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        auctionId,
        page,
        size,
      },
    });
    return res.data;
  } catch (err) {
    console.log("loadBidHistories error: ", err);
    return null;
  }
};
