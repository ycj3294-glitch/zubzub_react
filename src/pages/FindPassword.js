import { useState, useEffect } from "react";
import AxiosAPI from "../api/AxiosAPI";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  width: 380px;
  background: #fff;
  border-radius: 14px;
  padding: 24px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  animation: popup 0.25s ease-out;

  @keyframes popup {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Title = styled.h3`
  margin-bottom: 16px;
  text-align: center;
`;

const Row = styled.div`
  margin-bottom: 14px;
`;

const Input = styled.input`
  width: 93%;
  height: 42px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ error }) => (error ? "#ff4d4f" : "#ccc")};
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  height: 42px;
  margin-top: 8px;
  border-radius: 8px;
  background: #111;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
`;

const FindPwdModal = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: 인증, 2: 변경

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState("");

  // 2. 모달이 열릴 때 혹시 모를 쓰레기 토큰 청소 (필터 방해 방지)
  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("signupToken");
  }, []);
  /* =========================
     STEP 1: 이메일 인증
  ========================= */

  const sendCode = async () => {
    try {
      await AxiosAPI.sendResetPwdCode(email);
      setError("");
    } catch {
      setError("인증번호 전송 실패");
    }
  };

  const verifyCode = async () => {
    try {
      const res = await AxiosAPI.verifyResetPwdCode(email, code);
      if (res.data === true) {
        setStep(2);
        setError("");
      } else {
        setError("인증번호가 올바르지 않습니다");
      }
    } catch {
      setError("인증 실패");
    }
  };

  /* =========================
   STEP 2: 비밀번호 변경
========================= */
  const resetPassword = async () => {
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      // ✅ 수정: email, password 뒤에 현재 들고 있는 'code'를 함께 전달해야 합니다!
      await AxiosAPI.resetPassword(email, password, code);
      alert("비밀번호가 변경되었습니다");
      onClose();
    } catch {
      setError("비밀번호 변경 실패");
    }
  };
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>✕</CloseBtn>

        {step === 1 && (
          <>
            <Title>비밀번호 찾기</Title>

            <Row>
              <Input
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Row>

            <Button onClick={sendCode}>인증번호 전송</Button>

            <Row>
              <Input
                placeholder="인증번호"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && <ErrorText>{error}</ErrorText>}
            </Row>

            <Button onClick={verifyCode}>인증번호 확인</Button>
          </>
        )}

        {step === 2 && (
          <>
            <Title>비밀번호 변경</Title>

            <Row>
              <Input
                type="password"
                placeholder="새 비밀번호"
                value={password}
                error={error.password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
              />
              {error.password && <ErrorText>{error.password}</ErrorText>}
            </Row>

            <Row>
              <Input
                type="password"
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                error={error.passwordConfirm}
                onChange={(e) =>
                  setPasswordConfirm(e.target.value.replace(/\s/g, ""))
                }
              />
              {error.passwordConfirm && (
                <ErrorText>{error.passwordConfirm}</ErrorText>
              )}
            </Row>

            <Button onClick={resetPassword}>비밀번호 변경</Button>
          </>
        )}
      </Modal>
    </Overlay>
  );
};

export default FindPwdModal;
