import styled from "styled-components";
import React from "react";
import { useNavigate } from "react-router-dom";

/* =====================
    styled
===================== */
const Container = styled.div`
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: "Noto Sans KR", sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  h1 {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 32px;
    letter-spacing: -0.5px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  align-items: stretch;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  &:before {
    content: "";
    width: 4px;
    height: 18 as px;
    background: #000;
    border-radius: 2px;
  }
`;

const FormRow = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    font-weight: 700;
    font-size: 13px;
    color: #888;
    margin-bottom: 10px;
  }
`;

/* ✅ 이메일 입력창과 버튼의 높이 및 정렬 보정 */
const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  width: 100%; /* 전체 너비 사용 */
`;

const Input = styled.input`
  flex: 1;
  padding: 13px 15px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: #fdfdfd;
  font-size: 14px;
  outline: none;
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
  width: 100%;
  transition: 0.2s;
  &:focus {
    border-color: #000;
    background: #fff;
  }
  &:disabled {
    background: #f5f5f5;
    color: #bbb;
  }
`;

const MiniBtn = styled.button`
  width: 100px; /* ✅ 버튼 너비 고정으로 인풋과 합쳐졌을 때 규격 유지 */
  height: 45px; /* ✅ 인풋 높이와 일치시킴 */
  border-radius: 12px;
  border: 1px solid #000;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0; /* 크기 줄어듦 방지 */
  &:hover {
    background: #000;
    color: #fff;
  }
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: auto;
  border-radius: 14px;
  border: none;
  background: #000;
  color: #fff;
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const CancelBtn = styled.button`
  margin-top: 40px;
  background: none;
  border: none;
  color: #bbb;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
`;

/* =====================
    Component
===================== */
const MyProfileEdit = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <h1>정보 수정</h1>
      </Header>

      <Grid>
        {/* 닉네임 섹션 */}
        <Card>
          <CardTitle>닉네임 설정</CardTitle>
          <FormRow>
            <label>현재 닉네임</label>
            <Input value="LeeTS" disabled />
          </FormRow>
          <FormRow>
            <label>새로운 닉네임</label>
            <Input placeholder="변경할 닉네임을 입력하세요" />
          </FormRow>
          <div style={{ flex: 1, minHeight: "85px" }}></div>{" "}
          {/* 높이 균형 조절 */}
          <SaveBtn
            onClick={() => {
              alert("닉네임 변경 완료!");
              navigate("/mypage");
            }}
          >
            닉네임 저장하기
          </SaveBtn>
        </Card>

        {/* 비밀번호 섹션 */}
        <Card>
          <CardTitle>비밀번호 보안</CardTitle>
          <FormRow>
            <label>이메일 인증</label>
            <InputGroup>
              <Input placeholder="55029564@gmail.com" />
              <MiniBtn>코드전송</MiniBtn>
            </InputGroup>
          </FormRow>
          <FormRow>
            <label>기존 비밀번호</label>
            <Input type="password" placeholder="현재 비밀번호 입력" />
          </FormRow>
          <FormRow>
            <label>새 비밀번호</label>
            <Input type="password" placeholder="새 비밀번호 입력" />
          </FormRow>
          <SaveBtn
            onClick={() => {
              alert("비밀번호 변경 완료!");
              navigate("/mypage");
            }}
          >
            비밀번호 변경하기
          </SaveBtn>
        </Card>
      </Grid>

      <div style={{ textAlign: "center" }}>
        <CancelBtn onClick={() => navigate("/mypage")}>
          수정 취소하고 마이페이지로 돌아가기
        </CancelBtn>
      </div>
    </Container>
  );
};

export default MyProfileEdit;
