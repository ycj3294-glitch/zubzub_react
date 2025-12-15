import styled from "styled-components";
import { useState } from "react";
import AxiosAPI from "../api/AxiosAPI";
import { emailRegex, passwordRegex, nicknameRegex } from "../utils/validators";

/* =========================
   styles
========================= */

const Container = styled.div`
  max-width: 420px;
  margin: 100px auto;
`;

const Row = styled.div`
  margin-bottom: 16px;
`;

const Button = styled.button`
  margin-left: 8px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const SuccessText = styled.div`
  color: green;
  font-size: 12px;
  margin-top: 4px;
`;

/* =========================
   Component
========================= */

const Signup = () => {
  /* ---------- email ---------- */
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  /* ---------- password ---------- */
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  /* ---------- nickname ---------- */
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);

  /* ---------- errors ---------- */
  const [errors, setErrors] = useState({
    email: "",
    emailCode: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });

  /* =========================
     이메일 인증
  ========================= */

  const sendEmailCode = async () => {
    if (!emailRegex.test(email)) {
      setErrors((p) => ({ ...p, email: "이메일 형식이 올바르지 않습니다" }));
      return;
    }

    setErrors((p) => ({ ...p, email: "" }));

    try {
      await AxiosAPI.sendEmailCode(email);
    } catch {
      setErrors((p) => ({
        ...p,
        email: "인증번호 전송에 실패했습니다",
      }));
    }
  };

  const verifyEmailCode = async () => {
    if (!emailCode) {
      setErrors((p) => ({ ...p, emailCode: "인증번호를 입력하세요" }));
      return;
    }

    try {
      const res = await AxiosAPI.verifyEmailCode(email, emailCode);
      if (res.data === true) {
        setEmailVerified(true);
        setErrors((p) => ({ ...p, emailCode: "" }));
      } else {
        setErrors((p) => ({
          ...p,
          emailCode: "인증번호가 올바르지 않습니다",
        }));
      }
    } catch {
      setErrors((p) => ({ ...p, emailCode: "인증에 실패했습니다" }));
    }
  };

  /* =========================
     닉네임 중복 확인
  ========================= */

  const checkNickname = async () => {
    if (!nicknameRegex.test(nickname)) {
      setErrors((p) => ({
        ...p,
        nickname: "닉네임은 2~10자의 완성형 한글, 영문, 숫자만 가능합니다",
      }));
      return;
    }

    try {
      const res = await AxiosAPI.checkNickname(nickname);

      if (res.data === true) {
        setErrors((p) => ({
          ...p,
          nickname: "이미 사용 중인 닉네임입니다",
        }));
        setNicknameChecked(false);
      } else {
        setErrors((p) => ({ ...p, nickname: "" }));
        setNicknameChecked(true);
      }
    } catch {
      setErrors((p) => ({
        ...p,
        nickname: "닉네임 중복 확인 실패",
      }));
    }
  };

  /* =========================
     회원가입
  ========================= */

  const signupHandler = async () => {
    let valid = true;
    const newErrors = {};

    if (!emailVerified) {
      newErrors.email = "이메일 인증을 완료하세요";
      valid = false;
    }

    if (!passwordRegex.test(password)) {
      newErrors.password = "비밀번호는 8자 이상, 영문 + 숫자 조합이어야 합니다";
      valid = false;
    }

    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력하세요";
      valid = false;
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
      valid = false;
    }

    if (!nicknameChecked) {
      newErrors.nickname = "닉네임 중복 확인을 해주세요";
      valid = false;
    }

    setErrors((p) => ({ ...p, ...newErrors }));
    if (!valid) return;

    try {
      await AxiosAPI.signup(email, password, nickname);
      alert("회원가입 완료");
    } catch {
      alert("회원가입 실패");
    }
  };

  /* =========================
     Render
  ========================= */

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
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: "" }));
          }}
        />
        <Button onClick={sendEmailCode} disabled={emailVerified}>
          인증번호 전송
        </Button>
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </Row>

      {/* 이메일 인증번호 */}
      <Row>
        이메일 인증번호
        <input
          type="text"
          value={emailCode}
          disabled={emailVerified}
          onChange={(e) => {
            setEmailCode(e.target.value);
            setErrors((p) => ({ ...p, emailCode: "" }));
          }}
        />
        <Button onClick={verifyEmailCode} disabled={emailVerified}>
          인증번호 확인
        </Button>
        {errors.emailCode && <ErrorText>{errors.emailCode}</ErrorText>}
      </Row>

      {/* 비밀번호 */}
      <Row>
        비밀번호
        <input
          type="password"
          value={password}
          onChange={(e) => {
            const next = e.target.value;
            setPassword(next);
            setErrors((p) => ({
              ...p,
              password: "",
              passwordConfirm:
                passwordConfirm && next !== passwordConfirm
                  ? "비밀번호가 일치하지 않습니다"
                  : "",
            }));
          }}
        />
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
      </Row>

      {/* 비밀번호 확인 */}
      <Row>
        비밀번호 확인
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => {
            const next = e.target.value;
            setPasswordConfirm(next);
            setErrors((p) => ({
              ...p,
              passwordConfirm:
                next && password !== next ? "비밀번호가 일치하지 않습니다" : "",
            }));
          }}
        />
        {errors.passwordConfirm && (
          <ErrorText>{errors.passwordConfirm}</ErrorText>
        )}
        {!errors.passwordConfirm &&
          passwordConfirm &&
          password === passwordConfirm && (
            <SuccessText>비밀번호가 일치합니다</SuccessText>
          )}
      </Row>

      {/* 닉네임 */}
      <Row>
        닉네임
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setNicknameChecked(false); // ⭐ 값 변경 시 다시 확인
            setErrors((p) => ({ ...p, nickname: "" }));
          }}
        />
        <Button onClick={checkNickname} disabled={!nickname}>
          중복 확인
        </Button>
        {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
        {nicknameChecked && !errors.nickname && (
          <SuccessText>사용 가능한 닉네임입니다</SuccessText>
        )}
      </Row>

      <button onClick={signupHandler}>회원가입</button>
    </Container>
  );
};

export default Signup;
