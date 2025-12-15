import styled from "styled-components";
import { useState } from "react";
import AxiosAPI from "../api/AxiosAPI";
import { emailRegex, passwordRegex, nicknameRegex } from "../utils/validators";

const Container = styled.div`
  max-width: 400px;
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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(""); // ✅ 추가
  const [nickname, setNickname] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    emailCode: "",
    password: "",
    passwordConfirm: "", // ✅ 추가
    nickname: "",
  });

  /* =========================
     이메일 인증
  ========================= */
  const sendEmailCode = async () => {
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일 형식이 올바르지 않습니다",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, email: "" }));

    try {
      await AxiosAPI.sendEmailCode(email);
    } catch (e) {
      setErrors((prev) => ({ ...prev, email: "인증번호 전송에 실패했습니다" }));
    }
  };

  const verifyEmailCode = async () => {
    if (!emailCode) {
      setErrors((prev) => ({ ...prev, emailCode: "인증번호를 입력하세요" }));
      return;
    }

    try {
      const res = await AxiosAPI.verifyEmailCode(email, emailCode);
      if (res.data === true) {
        setEmailVerified(true);
        setErrors((prev) => ({ ...prev, emailCode: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          emailCode: "인증번호가 올바르지 않습니다",
        }));
      }
    } catch (e) {
      setErrors((prev) => ({ ...prev, emailCode: "인증에 실패했습니다" }));
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

    // ✅ 비밀번호 정규식
    if (!passwordRegex.test(password)) {
      newErrors.password = "비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다";
      valid = false;
    }

    // ✅ 비밀번호 확인 불일치
    if (!passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력하세요";
      valid = false;
    } else if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
      valid = false;
    }

    if (!nicknameRegex.test(nickname)) {
      newErrors.nickname = "닉네임은 2~10자의 한글/영문/숫자만 가능합니다";
      valid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    if (!valid) return;

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
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        <Button onClick={sendEmailCode} disabled={emailVerified}>
          인증번호 전송
        </Button>
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </Row>

      {/* 인증번호 */}
      <Row>
        이메일 인증번호
        <input
          type="text"
          value={emailCode}
          disabled={emailVerified}
          onChange={(e) => {
            setEmailCode(e.target.value);
            setErrors((prev) => ({ ...prev, emailCode: "" }));
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
            setErrors((prev) => ({
              ...prev,
              password: "",
              // ✅ 비밀번호가 바뀌면 확인도 다시 검증
              passwordConfirm:
                passwordConfirm && next !== passwordConfirm
                  ? "비밀번호가 일치하지 않습니다"
                  : "",
            }));
          }}
        />
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
      </Row>

      {/* ✅ 비밀번호 확인 */}
      <Row>
        비밀번호 확인
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => {
            const next = e.target.value;
            setPasswordConfirm(next);
            setErrors((prev) => ({
              ...prev,
              passwordConfirm:
                next && password !== next
                  ? "비밀번호가 일치하지 않습니다"
                  : "비밀번호가 일치합니다.",
            }));
          }}
        />
        {errors.passwordConfirm && (
          <ErrorText>{errors.passwordConfirm}</ErrorText>
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
            setErrors((prev) => ({ ...prev, nickname: "" }));
          }}
        />
        {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
      </Row>

      <button onClick={signupHandler}>회원가입</button>
    </Container>
  );
};

export default Signup;
