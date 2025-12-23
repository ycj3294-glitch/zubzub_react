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

export default AxiosApi;
