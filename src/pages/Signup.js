import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../api/AxiosApi";
import styled from "styled-components";
import Button from "../components/common/ButtonComponent";
import Input from "../components/common/InputComponent";
import Modal from "../components/common/ModalComponent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  max-width: 400px;
  margin: 0 auto;
`;

const Message = styled.p`
  font-size: 12px;
  color: ${(props) => (props.valid ? "#2ecc71" : "#e74c3c")};
  margin: 0;
  align-self: flex-start;
`;

const Signup = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [inputPwConfirm, setInputPwConfirm] = useState("");
  const [inputName, setInputName] = useState("");

  const [validation, setValidation] = useState({
    email: false,
    pw: false,
    pwConfirm: false,
    name: false,
  });

  // 모달 내용을 변경
  const [modalContent, setModalContent] = useState("");
  // 모달 팝업 처리
  const [modalOpen, setModalOpen] = useState(false); // 초기값은 닫힌 상태
  const closeModal = () => {
    // 모달을 닫는 함수
    setModalOpen(false);
  };

  // 모달 내용을 변경
  const [redirectModalContent, setRedirectModalContent] = useState("");
  // 모달 팝업 처리
  const [redirectModalOpen, setRedirectModalOpen] = useState(false); // 초기값은 닫힌 상태
  const redirectCloseModal = () => {
    // 모달을 닫는 함수
    setRedirectModalOpen(false);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  const nameRegex = /^[가-힣a-zA-Z\d]{2,20}$/;

  const nav = useNavigate();

  const onClickSignup = async () => {
    try {
      const exists = await AxiosApi.regCheck(inputEmail);
      console.log(exists);
      if (exists.data) {
        setModalOpen(true);
        setModalContent("이미 존재하는 이메일입니다");
        return;
      } else {
        const res = await AxiosApi.signup(inputEmail, inputPw, inputName);
        console.log(res);
        if (res.data) {
          setRedirectModalOpen(true);
          setRedirectModalContent("로그인 창으로 이동합니까?");
        } else {
          // 기타 입력값 오류 시
        }
      }
    } catch (e) {
      setModalOpen(true);
      setModalContent("서버가 응답하지 않습니다." + e);
    }
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="이메일"
        value={inputEmail}
        onChange={(e) => {
          setInputEmail(e.target.value);
          setValidation({
            ...validation,
            email: emailRegex.test(e.target.value),
          });
        }}
      />
      <Message valid={validation.email}>
        {validation.email ? "사용가능" : "이메일 형식으로 입력해주세요"}
      </Message>
      <Input
        type="password"
        placeholder="패스워드"
        value={inputPw}
        onChange={(e) => {
          setInputPw(e.target.value);
          setValidation({
            ...validation,
            pw: pwRegex.test(e.target.value),
            pwConfirm: e.target.value === inputPwConfirm,
          });
        }}
      />
      <Message valid={validation.pw}>
        {validation.pw
          ? "사용가능"
          : "8~20자리 영문 대소문자와 특수기호가 포함되어야 합니다"}
      </Message>
      <Input
        type="password"
        placeholder="패스워드 확인"
        value={inputPwConfirm}
        onChange={(e) => {
          setInputPwConfirm(e.target.value);
          setValidation({
            ...validation,
            pwConfirm: e.target.value === inputPw,
          });
        }}
      />
      <Message valid={validation.pwConfirm}>
        {validation.pwConfirm ? "사용가능" : "비밀번호가 일치하지 않습니다"}
      </Message>
      <Input
        type="text"
        placeholder="이름"
        value={inputName}
        onChange={(e) => {
          setInputName(e.target.value);
          setValidation({
            ...validation,
            name: nameRegex.test(e.target.value),
          });
        }}
      />
      <Message valid={validation.name}>
        {validation.name
          ? "사용가능"
          : "2~10자리 영문 한글 숫자로 입력해주세요"}
      </Message>
      <Button
        onClick={onClickSignup}
        enabled={Object.values(validation).every((value) => value === true)}
      >
        회원가입
      </Button>
      <Modal open={modalOpen} close={closeModal} header="오류">
        {modalContent}
      </Modal>
      <Modal
        open={redirectModalOpen}
        close={redirectCloseModal}
        type={"application"}
        confirm={() => nav("/")}
        header="로그인창으로"
      >
        {redirectModalContent}
      </Modal>
    </Container>
  );
};

export default Signup;
