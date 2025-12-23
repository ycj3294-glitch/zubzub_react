import { useState, useEffect } from "react";
import styled from "styled-components";
import AxiosAPI from "../api/AxiosAPI";
import { emailRegex, passwordRegex, nicknameRegex } from "../utils/validators";
import { useNavigate } from "react-router-dom";

/* =========================
    Styled Components
========================= */

const SignupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 60px; /* 로고가 없으므로 상단에 적절히 배치 */
  min-height: 100vh;
  background-color: #fcfcfc;
  font-family: "Noto Sans KR", sans-serif;
`;

const SignupCard = styled.div`
  width: 100%;
  max-width: 450px;
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

const Row = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;

  label {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    margin-left: 5px;
    font-weight: bold;
  }

  .input-box {
    display: flex;
    gap: 8px;
  }

  input {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid #ddd;
    font-size: 15px;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #000;
    }
    &:disabled {
      background-color: #f5f5f5;
      color: #aaa;
    }
  }
`;

const SideButton = styled.button`
  padding: 0 15px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  font-family: "dnf bitbit v2", sans-serif;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 5px;
`;

const SuccessText = styled.div`
  color: #28a745;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 5px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #888;
  color: white;
  border: none;
  border-radius: 30px;
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #333;
  }
`;

/* =========================
    Component Logic
========================= */

const Signup = () => {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    emailCode: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });

  const sendEmailCode = async () => {
    if (!emailRegex.test(email)) {
      setErrors((p) => ({ ...p, email: "이메일 형식이 올바르지 않습니다" }));
      return;
    }
    setErrors((p) => ({ ...p, email: "" }));
    try {
      const token = await AxiosAPI.sendEmailCode(email);
      alert("인증번호가 전송되었습니다.");
      localStorage.setItem("signupToken", token.data);
    } catch {
      setErrors((p) => ({ ...p, email: "인증번호 전송에 실패했습니다" }));
    }
  };

  const verifyEmailCode = async () => {
    if (!emailCode) {
      setErrors((p) => ({ ...p, emailCode: "인증번호를 입력하세요" }));
      return;
    }
    try {
      console.log("코드", emailCode);

      const res = await AxiosAPI.verifyEmailCode(emailCode);
      if (res.data === true) {
        setEmailVerified(true);
        setErrors((p) => ({ ...p, emailCode: "" }));
      } else {
        setErrors((p) => ({ ...p, emailCode: "인증번호가 올바르지 않습니다" }));
      }
    } catch {
      setErrors((p) => ({ ...p, emailCode: "인증에 실패했습니다" }));
    }
  };

  const checkNickname = async () => {
    if (!nicknameRegex.test(nickname)) {
      setErrors((p) => ({
        ...p,
        nickname: "2~10자 한글, 영문, 숫자만 가능합니다",
      }));
      return;
    }
    try {
      const res = await AxiosAPI.checkNickname(nickname);
      if (res.data === true) {
        setErrors((p) => ({ ...p, nickname: "이미 사용 중인 닉네임입니다" }));
        setNicknameChecked(false);
      } else {
        setErrors((p) => ({ ...p, nickname: "" }));
        setNicknameChecked(true);
      }
    } catch {
      setErrors((p) => ({ ...p, nickname: "중복 확인 실패" }));
    }
  };

  const signupHandler = async () => {
    let valid = true;
    const newErrors = {};

    if (!emailVerified) {
      newErrors.email = "이메일 인증을 완료하세요";
      valid = false;
    }
    if (!passwordRegex.test(password)) {
      newErrors.password = "8자 이상, 특수 문자 포함, 영문 포함 필수";
      valid = false;
    }
    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
      valid = false;
    }
    if (!nicknameChecked) {
      newErrors.nickname = "닉네임 중복 확인 필수";
      valid = false;
    }

    setErrors((p) => ({ ...p, ...newErrors }));
    if (!valid) return;

    try {
      await AxiosAPI.signup(email, password, nickname, emailCode);

      alert("🎉 회원가입이 완료되었습니다!");
      nav("/login");
    } catch {
      alert("회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!password) return;

    if (passwordRegex.test(password)) {
      setErrors((p) => ({ ...p, password: "" }));
    }
  }, [password]);

  return (
    <SignupWrapper>
      <SignupCard>
        <h2>회원가입</h2>

        {/* 이메일 */}
        <Row>
          <label>이메일</label>
          <div className="input-box">
            <input
              type="text"
              placeholder="example@zubzub.com"
              value={email}
              disabled={emailVerified}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: "" }));
              }}
            />
            <SideButton onClick={sendEmailCode} disabled={emailVerified}>
              전송
            </SideButton>
          </div>
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </Row>

        {/* 인증번호 */}
        <Row>
          <label>인증번호</label>
          <div className="input-box">
            <input
              type="text"
              placeholder="인증번호 6자리"
              value={emailCode}
              disabled={emailVerified}
              onChange={(e) => {
                setEmailCode(e.target.value);
                setErrors((p) => ({ ...p, emailCode: "" }));
              }}
            />
            <SideButton onClick={verifyEmailCode} disabled={emailVerified}>
              확인
            </SideButton>
          </div>
          {errors.emailCode && <ErrorText>{errors.emailCode}</ErrorText>}
          {emailVerified && <SuccessText>이메일 인증 완료</SuccessText>}
        </Row>

        {/* 비밀번호 */}
        <Row>
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="8자 이상 영문 + 숫자 + 특수문자"
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);

              if (!value) {
                setPasswordValid(false);
                setErrors((p) => ({ ...p, password: "" }));
                return;
              }

              if (passwordRegex.test(value)) {
                setPasswordValid(true);
                setErrors((p) => ({ ...p, password: "" }));
              } else {
                setPasswordValid(false);
              }
            }}
          />

          {errors.password && <ErrorText>{errors.password}</ErrorText>}
          {passwordValid && (
            <SuccessText>사용할 수 있는 비밀번호입니다</SuccessText>
          )}
        </Row>

        {/* 비밀번호 확인 */}
        <Row>
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordConfirm && password === passwordConfirm && (
            <SuccessText>비밀번호가 일치합니다</SuccessText>
          )}
          {passwordConfirm && password !== passwordConfirm && (
            <ErrorText>비밀번호가 일치하지 않습니다</ErrorText>
          )}
        </Row>
        {/* 이름 */}
        <Row>
          <lable>이름</lable>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Row>

        {/* 닉네임 */}
        <Row>
          <label>닉네임</label>
          <div className="input-box">
            <input
              type="text"
              placeholder="2 ~ 6자 이내"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameChecked(false);
              }}
            />
            <SideButton onClick={checkNickname}>중복 확인</SideButton>
          </div>
          {nicknameChecked && (
            <SuccessText>사용 가능한 닉네임입니다</SuccessText>
          )}
          {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
        </Row>

        <SubmitButton onClick={signupHandler}>가입하기</SubmitButton>
      </SignupCard>
    </SignupWrapper>
  );
};

export default Signup;
