import axios from "axios";

const BASE_URL = "http://localhost:8111";

/* =========================
   axios 인스턴스
========================= */
const AxiosAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true, // 세션 쿠키 포함
});

/* =========================
   Auth - 로그인 / 인증 유지
========================= */

// 로그인
AxiosAPI.login = async (email, password) => {
  return await AxiosAPI.post("/auth/login", {
    email,
    password,
  });
};

// 로그인 상태 확인 (인증 유지)
AxiosAPI.me = async () => {
  return await AxiosAPI.get("/auth/me");
};

// 로그아웃
AxiosAPI.logout = async () => {
  return await AxiosAPI.post("/auth/logout");
};

/* =========================
   Email 인증 (외부 API 연동)
========================= */

// 인증번호 전송
AxiosAPI.sendEmailCode = async (email) => {
  return await AxiosAPI.post("/auth/email/send", {
    email,
  });
};

// 인증번호 검증
AxiosAPI.verifyEmailCode = async (email, code) => {
  return await AxiosAPI.post("/auth/email/verify", {
    email,
    code,
  });
};

// 회원가입

AxiosAPI.signup = async (email, password, nickname) => {
  return await AxiosAPI.post("/auth/signup", {
    email,
    password,
    nickname,
  });
};

// 닉네임 중복 확인
AxiosAPI.checkNickname = async (nickname) => {
  return await AxiosAPI.get("/auth/nickname/exists", {
    params: { nickname },
  });
};

export default AxiosAPI;
