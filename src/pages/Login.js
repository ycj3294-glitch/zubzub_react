import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import AxiosAPI from "../api/AxiosAPI";
import { useAuth } from "../context/AuthContext";
import FindPwdModal from "./FindPassword";

/* =========================
    Styled Components
========================= */

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 로고가 빠진 만큼 상단 여백을 더 바짝 올림 */
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

  const { checkLogin, setAccessToken } = useAuth();
  const nav = useNavigate();

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
        const { accessToken, refreshToken, ...userData } = res.data;
        console.log("이건로그인시응답 : ", res.data);
        console.log("유저데이터 : ", userData);
        console.log("액세스토큰 : ", accessToken);
        console.log("저장한다");
        setAccessToken(accessToken);
        console.log("저장함");
        AxiosAPI.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        checkLogin();
        nav("/");
      } else {
        setErrors((p) => ({
          ...p,
          common: "이메일 또는 비밀번호가 올바르지 않습니다",
        }));
      }
    } catch {
      setErrors((p) => ({ ...p, common: "서버 오류가 발생했습니다" }));
    }
  };

  return (
    <LoginWrapper>
      {/* 로고 컨테이너 제거됨 */}
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
          {/* 아이디 찾기 -> 이메일 찾기로 변경 및 클릭 기능만 유지 */}
          <span
            onClick={() => {
              /* 기능 없음 */
            }}
          >
            이메일 찾기
          </span>
          <div className="divider" />
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
