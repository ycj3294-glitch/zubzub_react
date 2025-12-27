import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import AxiosAPI from "../api/AxiosAPI";
import { useAuth } from "../context/AuthContext";
import FindPwdModal from "./FindPassword";

/* =========================
    Styled Components (기존 유지)
========================= */
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 100px;
  min-height: 100vh;
  background-color: #fcfcfc;
  font-family: "Noto Sans KR", sans-serif;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 40px;
  border-radius: 30px;
  border: 1px solid #eee;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;

  h2 {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 26px;
    margin-bottom: 30px;
    text-align: left;
    color: #000;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 12px;
  input {
    width: 100%;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 15px;
    outline: none;
    transition: all 0.2s ease-in-out;
    &:focus {
      border-color: #000;
      background-color: #fcfcfc;
    }
    &::placeholder {
      color: #bbb;
    }
  }
`;

const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 5px;
  font-weight: 500;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #888;
  color: white;
  border: none;
  border-radius: 30px;
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 18px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #333;
  }
`;

const BottomMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
  a,
  span {
    font-size: 13px;
    color: #777;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: #000;
      text-decoration: underline;
    }
  }
  .divider {
    width: 1px;
    height: 12px;
    background-color: #e0e0e0;
  }
`;

/* =========================
    Component Logic
========================= */
const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errors, setErrors] = useState({ email: "", pwd: "", common: "" });
  const [showFindPwd, setShowFindPwd] = useState(false);

  // ✅ login 함수를 추가로 비구조화 할당
  const { setAccessToken, isLogin, login } = useAuth();
  const nav = useNavigate();

  // 이미 로그인된 상태라면 메인으로 리다이렉트
  if (isLogin) {
    nav("/");
  }

  const loginHandler = async () => {
    let valid = true;
    const newErrors = { email: "", pwd: "", common: "" };

    if (!email) {
      newErrors.email = "이메일을 입력하세요";
      valid = false;
    }
    if (!pwd) {
      newErrors.pwd = "비밀번호를 입력하세요";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      const res = await AxiosAPI.login(email, pwd);

      if (res.status === 200 || res.status === 201) {
        // ✅ 토큰과 나머지 유저 정보를 분리
        const { accessToken, refreshToken, ...userData } = res.data;

        console.log("로그인 응답 데이터:", res.data);

        // 1. Context 및 로컬스토리지에 액세스 토큰 저장
        setAccessToken(accessToken);

        // 2. ✅ 중요: AuthContext의 login을 호출하여 유저 상태 및 isAdmin 권한 세팅
        // 이렇게 해야 새로고침 없이도 즉시 관리자 메뉴가 활성화됩니다.
        login(userData, accessToken);

        console.log("로그인 완료 -> 메인 페이지로 이동");

        // 3. 메인으로 이동
        nav("/");
      } else {
        setErrors((p) => ({
          ...p,
          common: "이메일 또는 비밀번호가 올바르지 않습니다",
        }));
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrors((p) => ({
        ...p,
        common: "이메일 또는 비밀번호가 올바르지 않습니다",
      }));
    }
  };

  return (
    <LoginWrapper>
      <LoginCard>
        <h2>로그인</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginHandler();
          }}
        >
          <InputGroup>
            <input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: "", common: "" }));
              }}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <input
              type="password"
              placeholder="비밀번호"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setErrors((p) => ({ ...p, pwd: "", common: "" }));
              }}
            />
            {errors.pwd && <ErrorText>{errors.pwd}</ErrorText>}
            {errors.common && <ErrorText>{errors.common}</ErrorText>}
          </InputGroup>

          <LoginButton type="submit">로그인</LoginButton>
        </form>
        <BottomMenu>
          <span onClick={() => setShowFindPwd(true)}>비밀번호 찾기</span>
          <div className="divider" />
          <Link to="/signup">회원가입</Link>
        </BottomMenu>
      </LoginCard>

      {showFindPwd && <FindPwdModal onClose={() => setShowFindPwd(false)} />}
    </LoginWrapper>
  );
};

export default Login;
