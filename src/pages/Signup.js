import styled from "styled-components";
import { useState } from "react";
import AxiosAPI from "../api/AxiosAPI";
import { emailRegex, passwordRegex, nicknameRegex } from "../utils/validators";

const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
`;

const Row = styled.div`
  margin-bottom: 12px;
`;

const Button = styled.button`
  margin-left: 8px;
`;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  /* =========================
     이메일 인증
  ========================= */

  const sendEmailCode = async () => {
    try {
      await AxiosAPI.sendEmailCode(email);
      alert("인증번호가 이메일로 전송되었습니다");
    } catch (e) {
      alert("인증번호 전송 실패");
    }
  };

  const verifyEmailCode = async () => {
    try {
      const res = await AxiosAPI.verifyEmailCode(email, emailCode);

      if (res.data === true) {
        setEmailVerified(true);
        alert("이메일 인증 완료");
      } else {
        alert("인증번호가 올바르지 않습니다");
      }
    } catch (e) {
      alert("인증 실패");
    }
  };

  /* =========================
     회원가입
  ========================= */

  const signupHandler = async () => {
    if (!emailVerified) {
      alert("이메일 인증을 완료하세요");
      return;
    }

    try {
      await AxiosAPI.signup(email, password, nickname);
      alert("회원가입 완료");
    } catch (e) {
      alert("회원가입 실패");
    }
  };

  return (
    <Container>
      <h2>회원가입</h2>

      {/* 이메일 */}
      <Row>
        이메일
        <input
          type="text"
          value={email}
          disabled={emailVerified}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={sendEmailCode} disabled={!email || emailVerified}>
          인증번호 전송
        </Button>
      </Row>

      {/* 인증번호 */}
      <Row>
        이메일 인증번호
        <input
          type="text"
          value={emailCode}
          disabled={emailVerified}
          onChange={(e) => setEmailCode(e.target.value)}
        />
        <Button onClick={verifyEmailCode} disabled={emailVerified}>
          인증번호 확인
        </Button>
      </Row>

      {/* 비밀번호 */}
      <Row>
        비밀번호
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Row>

      {/* 닉네임 */}
      <Row>
        닉네임
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </Row>

      <button
        onClick={signupHandler}
        disabled={!emailVerified || !password || !nickname}
      >
        회원가입
      </button>
    </Container>
  );
};

export default Signup;
