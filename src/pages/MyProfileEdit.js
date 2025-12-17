// MyProfileEdit.js (마이페이지 - 회원정보 수정)

import styled from "styled-components";
import React, { useState } from "react";

/* =========================
   Styled Components (이미지 디자인 반영)
========================= */

const Container = styled.div`
  max-width: 1000px;
  margin: 50px auto;
  padding: 0 16px;
  text-align: center;
`;

const HeaderImage = styled.div`
  /* 이미지의 '줍줍' 텍스트와 망치 아이콘을 표현 */
  font-size: 80px;
  font-weight: 900;
  margin-bottom: 40px;
  color: #000;
  letter-spacing: 5px;

  /* 망치 아이콘을 간단히 텍스트/이모지로 대체하거나, 실제 이미지를 사용해야 함 */
  &:after {
    content: " 🔨";
    font-size: 50px;
    display: inline-block;
    vertical-align: top;
    line-height: 1;
  }
`;

const WhiteBox = styled.div`
  border: 4px solid #000;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-around;
  gap: 30px;
  background: white;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
`;

/* --- 개별 수정 영역 (닉네임/비밀번호) --- */

const EditSection = styled.div`
  flex: 1;
  padding: 30px 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

  &:first-child {
    margin-right: 15px;
  }

  @media (max-width: 768px) {
    margin: 0 !important;
  }
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 30px;
  color: #000;
`;

/* --- 폼 요소 --- */

const FormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
  padding: 0 10px;

  /* 비밀번호 수정 폼의 레이블 너비 확보 */
  & > span:first-child {
    min-width: 100px;
    text-align: left;
    font-weight: bold;
    color: #333;
  }
`;

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  gap: 5px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 0;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
`;

const AuthButton = styled.button`
  padding: 10px 15px;
  border: none;
  background: #333;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 0;
  height: 40px;
`;

/* --- 버튼 --- */

const SubmitButton = styled.button`
  width: 150px;
  padding: 12px 0;
  margin-top: 30px;
  border: 2px solid #000;
  background: #e0e0e0;
  color: #000;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s;

  &:hover {
    background: #ccc;
  }
`;

/* =========================
   Component
========================= */

const MyProfileEdit = () => {
  // 폼 상태 관리 (더미)
  const [nickname, setNickname] = useState({
    current: "NICKNAME TEXT",
    new: "",
  });
  const [password, setPassword] = useState({});

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    alert(`닉네임 변경 요청: ${nickname.new}`);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    alert("비밀번호 변경 요청 (인증 로직 필요)");
  };

  return (
    <Container>
      <HeaderImage>줍줍</HeaderImage>

      <WhiteBox>
        {/* 1. 닉네임 수정 섹션 */}
        <EditSection>
          <SectionTitle>닉네임 수정</SectionTitle>
          <form onSubmit={handleNicknameSubmit}>
            <FormRow>
              <span>기존 닉네임</span>
              <Input
                type="text"
                value={nickname.current}
                readOnly
                style={{ background: "#f0f0f0" }}
              />
            </FormRow>
            <FormRow>
              <span>새로운 닉네임</span>
              <Input
                type="text"
                value={nickname.new}
                onChange={(e) =>
                  setNickname({ ...nickname, new: e.target.value })
                }
                placeholder="NICKNAME TEXT"
              />
            </FormRow>
            <SubmitButton type="submit">닉네임 변경</SubmitButton>
          </form>
        </EditSection>

        {/* 2. 비밀번호 수정 섹션 */}
        <EditSection>
          <SectionTitle>비밀번호 수정</SectionTitle>
          <form onSubmit={handlePasswordSubmit}>
            <FormRow>
              <span>이메일</span>
              <InputGroup>
                <Input type="email" placeholder="EMAIL TEXT" />
                <AuthButton>인증번호 전송</AuthButton>
              </InputGroup>
            </FormRow>

            <FormRow>
              <span>인증번호</span>
              <InputGroup>
                <Input type="text" placeholder="TEXT" />
                <AuthButton>인증번호 확인</AuthButton>
              </InputGroup>
            </FormRow>

            <FormRow>
              <span>기존 비밀번호</span>
              <Input type="password" placeholder="PW TEXT" />
            </FormRow>

            <FormRow>
              <span>새로운 비밀번호</span>
              <Input type="password" placeholder="PW TEXT" />
            </FormRow>

            <FormRow>
              <span>새로운 비밀번호 확인</span>
              <Input type="password" placeholder="PW TEXT" />
            </FormRow>

            <SubmitButton type="submit">비밀번호 변경</SubmitButton>
          </form>
        </EditSection>
      </WhiteBox>
    </Container>
  );
};

export default MyProfileEdit;
