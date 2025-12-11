import axios from "axios"; // axios 비동기 통신 라이브러리를 가져옴
const HM_DOMAIN = "http://localhost:8111";

const AxiosApi = {
  // 로그인
  login: async (email, pwd) => {
    return await axios.post(
      HM_DOMAIN + "/auth/login",
      {
        username: email,
        password: pwd,
      },
      { withCredentials: true }
    );
  },
  // 회원 가입 여부 확인
  regCheck: async (email) => {
    return await axios.get(HM_DOMAIN + `/auth/exists/${email}`);
  },
  // 회원 가입
  signup: async (email, pwd, name) => {
    return await axios.post(HM_DOMAIN + "/auth/signup", { email, pwd, name });
  },
};

export default AxiosApi;
