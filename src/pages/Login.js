import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosAPI from "../api/AxiosAPI";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import { Link } from "react-router-dom";

const LinkRow = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 16px;

  a {
    color: #555;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Container = styled.div`
  max-width: 360px;
  margin: 100px auto;
`;

const Row = styled.div`
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const Button = styled.button`
  width: 100%;
  margin-top: 16px;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    pwd: "",
    common: "", // 아이디/비밀번호 틀림
  });

  const { login } = useAuth();
  const nav = useNavigate();

  const loginHandler = async () => {
    let valid = true;
    const newErrors = {};

    if (!email) {
      newErrors.email = "이메일을 입력하세요";
      valid = false;
    }

    if (!pwd) {
      newErrors.pwd = "비밀번호를 입력하세요";
      valid = false;
    }

    setErrors((p) => ({ ...p, ...newErrors }));
    if (!valid) return;

    try {
      const res = await AxiosAPI.login(email, pwd);

      if (res.data === true) {
        login({ email });
        nav("/");
      } else {
        setErrors((p) => ({
          ...p,
          common: "이메일 또는 비밀번호가 올바르지 않습니다",
        }));
      }
    } catch {
      setErrors((p) => ({
        ...p,
        common: "서버 오류가 발생했습니다",
      }));
    }
  };

  return (
    <Container>
      <h2>로그인</h2>

      {/* 이메일 */}
      <Row>
        <input
          type="text"
          value={email}
          placeholder="이메일"
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: "", common: "" }));
          }}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </Row>

      {/* 비밀번호 */}
      <Row>
        <input
          type="password"
          value={pwd}
          placeholder="비밀번호"
          onChange={(e) => {
            setPwd(e.target.value);
            setErrors((p) => ({ ...p, pwd: "", common: "" }));
          }}
        />
        {errors.pwd && <ErrorText>{errors.pwd}</ErrorText>}
      </Row>
      {/* 공통 에러 */}
      {errors.common && <ErrorText>{errors.common}</ErrorText>}

      <LinkRow>
        <Link to="/find-password">비밀번호 찾기</Link>
        <Link to="/signup">회원가입</Link>
      </LinkRow>

      <Button onClick={loginHandler}>로그인</Button>
    </Container>
  );
};

export default Login;
