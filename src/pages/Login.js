import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosAPI from "../api/AxiosAPI";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState({
    email: "",
    pwd: "",
  });

  const { login } = useAuth();
  const nav = useNavigate();

  const ErrorText = styled.div`
    color: red;
    font-size: 12px;
    margin-top: 4px;
  `;

  const loginHandler = async () => {
    if (!email || !pwd) {
      alert("이메일과 비밀번호를 입력하세요");
      return;
    }

    try {
      const res = await AxiosAPI.login(email, pwd);

      if (res.data === true) {
        login({ email }); // Context 상태 저장
        nav("/"); // 홈 이동
      } else {
        alert("아이디 또는 비밀번호가 틀렸습니다");
      }
    } catch (e) {
      console.error(e);
      alert("서버 오류");
    }
  };

  return (
    <>
      <div>
        이메일
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        비밀번호
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
      </div>
      <button onClick={loginHandler}>로그인</button>
    </>
  );
};

export default Login;
