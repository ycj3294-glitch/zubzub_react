import axios from "axios";

const BASE_URL = "http://localhost:8111";

/* =========================
   axios 인스턴스
========================= */
const AxiosApi = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

/* =========================
   Auth - 로그인 / 인증 유지
========================= */

// 로그인
AxiosApi.login = async (email, pwd) => {
  return await AxiosApi.post(
    "/api/members/login",
    {
      email,
      pwd,
    },
    {
      withCredentials: true,
    }
  );
};

// 로그인 상태 확인 (인증 유지)
AxiosApi.me = async () => {
  return await AxiosApi.get("/api/members/me");
};

// 액세스 토큰 재발급
AxiosApi.refresh = async () => {
  return await AxiosApi.get("/api/members/token/refresh", {
    withCredentials: true,
  });
};

// 로그아웃
AxiosApi.logout = async () => {
  return await AxiosApi.post("/api/members/logout", null, {
    withCredentials: true,
  });
};

/* =========================
   Email 인증 (외부 API 연동)
========================= */

// 인증번호 전송
AxiosApi.sendEmailCode = async (email) => {
  return await AxiosApi.post("/api/email/send", { email });
};

// 인증번호 검증
AxiosApi.verifyEmailCode = async (code) => {
  const token = localStorage.getItem("signupToken");
  return await AxiosApi.post(
    "/api/email/verify",
    { code },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// 회원가입
AxiosApi.signup = async (email, pwd, name, nickname, code) => {
  const token = localStorage.getItem("signupToken");
  return await AxiosApi.post(
    "/api/members/signup",
    {
      email,
      pwd,
      name,
      nickname,
      code,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

/* =========================
   비번 찾기 / 인증 변경
========================= */

// 인증번호 전송 (비밀번호 찾기)
AxiosApi.sendResetPwdCode = async (email) => {
  return await AxiosApi.post("/api/members/password-reset/request", { email });
};

// 인증번호 검증 및 비밀번호 재설정
AxiosApi.verifyResetPwdCode = async (email, code) => {
  return await AxiosApi.post("/api/members/password-reset/verify", {
    email,
    code,
    newPassword: "임시", // 실제 변경 시에는 resetPassword 함수 따로 호출
  });
};

// 비밀번호 변경
AxiosApi.resetPassword = async (email, newPassword, code) => {
  return await AxiosApi.post("/api/members/password-reset/verify", {
    email,
    code,
    newPassword,
  });
};

// 닉네임 중복 확인
AxiosApi.checkNickname = async (nickname) => {
  return await AxiosApi.get("/api/members/check-nickname", {
    params: { nickname },
  });
};

// 대규모 경매 승인 대기 목록 조회
AxiosApi.getPendingAuctions = async () => {
  return await AxiosApi.get("/api/admin/pending");
};

// 대규모 경매 승인 및 일정 등록
AxiosApi.approveAuction = async (id, startTime) => {
  return await AxiosApi.post("/api/admin/approve", {
    id,
    startTime,
  });
};

// 회원 정보 조회
AxiosApi.getUserInfo = async (id) => {
  return await AxiosApi.get(`/api/members/${id}`);
};

// 크레딧 충전
AxiosApi.chargeCredit = async (userId, amount) => {
  return await AxiosApi.post(`/api/members/${userId}/credit?coin=${amount}`);
};

// 낙찰 리스트 조회
AxiosApi.getWinList = async (userId) => {
  return await AxiosApi.get(`/api/auctions/${userId}/win5`, {});
};

// 판매 리스트 조회
AxiosApi.getSellList = async (userId) => {
  return await AxiosApi.get(`/api/auctions/${userId}/sell5`, {});
};

export default AxiosApi;

/* =========================
   경매
========================= */

export const getAuction = async (auctionId) => {
  try {
    const res = await axios.get(`/api/auctions/${auctionId}`);
    return res.data;
  } catch (err) {
    console.error("getAuction error:", err);
    return null;
  }
};

export const createAuction = async (auctionFormData) => {
  try {
    const res = await axios.post(`/api/auctions`, auctionFormData, {
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
    const res = await axios.post(
      `/api/auctions/${auctionId}/bids`,
      bidFormData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.status === 200 || res.status === 201;
  } catch (err) {
    console.error("createBid error:", err);
    return false;
  }
};

/* =========================
   입찰내역
========================= */

export const loadBidHistories = async (auctionId, page, size = 20) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/bid-histories`, {
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

/* =========================
   채팅
========================= */

export const getMessages = async (chatId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/chats${chatId}/messages`);
    return res.data;
  } catch (err) {
    console.error("getMessages error:", err);
    return [];
  }
};

export const sendMessage = async (chatId, messageData) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/chats${chatId}/messages`,
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

/* =========================
   메시지
========================= */

export const createMessage = async (messageData) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/messages`, messageData);
    return res.data;
  } catch (err) {
    console.error("createMessage error:", err);
  }
};

export const getReceivedMessages = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/messages/received`);
    return res.data;
  } catch (err) {
    console.error("getReceivedMessages error:", err);
  }
};

export const getMessage = async (messageId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/messages/${messageId}`);
    return res.data;
  } catch (err) {
    console.error("getMessage error:", err);
  }
};

export const readMessage = async (messageId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/messages/${messageId}/read`,
      null
    );
    return res.data;
  } catch (err) {
    console.error("readMessage error:", err);
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/messages/${messageId}/delete`,
      null
    );
    return res.data;
  } catch (err) {
    console.error("deleteMessage error:", err);
  }
};
