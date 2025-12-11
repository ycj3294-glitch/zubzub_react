import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import imgLogo from "../images/kakaoLion.png";
import AxiosApi from "../api/AxiosApi";
import Input from "../components/common/InputComponent";
import Button from "../components/common/ButtonComponent";
import Modal from "../components/common/ModalComponent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px; /* 모바일 화면 등을 위해 약간의 여백 추가 */
`;

const Items = styled.div`
  display: flex;
  align-items: center;
  /* margin prop이 없으면 기본 10px 적용 */
  margin: ${(props) => props.margin || "10px"};
  justify-content: ${(props) => props.justify || "flex-start"};
  width: 100%; /* Input 등이 꽉 차게 보이도록 설정 */

  /* 로고 영역 스타일 */
  ${(props) =>
    props.variant === "sign" &&
    css`
      margin-top: 80px;
      margin-bottom: 40px;
      justify-content: center;
    `}

  /* 회원가입 링크 영역 스타일 */
  ${(props) =>
    props.variant === "signup" &&
    css`
      justify-content: flex-end;
      margin-top: 20px;
      font-size: 14px;

      .link_style {
        color: orange;
        text-decoration: none;
        font-weight: 700;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    `}
`;

const Img = styled.img`
  width: 180px;
  object-fit: cover;
`;

const Login = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");

  // 모달 내용을 변경
  const [modalContent, setModalContent] = useState("");
  // 모달 팝업 처리
  const [modalOpen, setModalOpen] = useState(false); // 초기값은 닫힌 상태
  const closeModal = () => {
    // 모달을 닫는 함수
    setModalOpen(false);
  };

  const navigate = useNavigate(); // 변수명 nav -> navigate (관습적 명명)

  const onClickLogin = async () => {
    // 유효성 검사 (빈 값 방지)
    if (!inputEmail || !inputPw) {
      setModalOpen(true);
      setModalContent("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await AxiosApi.login(inputEmail, inputPw);
      console.log(res);

      if (res.data === true) {
        // 서버 응답 조건 명확히 (res.data만 쓰면 빈 객체도 true로 인식될 수 있음)
        localStorage.setItem("email", inputEmail);
        localStorage.setItem("isLogin", "TRUE"); // 오타 수정: isLoign -> isLogin
        navigate("/home"); // 절대 경로 사용 권장
      } else {
        // 서버의 응답을 줬지만 성공이 아닌 경우
        setModalOpen(true);
        setModalContent("아이디 및 패스워드를 재 확인 해 주세요.");
      }
    } catch (e) {
      console.error(e); // 개발자 디버깅용 로그
      // 서버가 응답하지 않는 경우
      setModalOpen(true);
      setModalContent("서버가 응답하지 않습니다.");
    }
  };

  // 엔터키 입력 시 로그인 실행을 위한 핸들러 (form 태그 사용 시 자동 처리되지만 명시적으로 제어 가능)
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 리로드 방지
    onClickLogin();
  };

  return (
    <Container>
      <Items variant="sign">
        <Img src={imgLogo} alt="Logo" />
      </Items>

      {/* form 태그로 감싸면 Input에서 엔터키를 눌렀을 때 로그인이 실행됩니다. */}
      <form onSubmit={handleSubmit}>
        <Items>
          <Input
            type="text"
            placeholder="이메일"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
        </Items>

        <Items>
          <Input
            type="password"
            placeholder="비밀번호"
            value={inputPw}
            onChange={(e) => setInputPw(e.target.value)}
            autoComplete="off"
          />
        </Items>

        <Items>
          <Button enabled type="submit">
            SIGN IN
          </Button>
        </Items>
      </form>

      <Items variant="signup">
        <Link to="/Signup" className="link_style">
          <span>Sign Up</span>
        </Link>
      </Items>
      <Modal open={modalOpen} close={closeModal} header="오류">
        {modalContent}
      </Modal>
    </Container>
  );
};

export default Login;
