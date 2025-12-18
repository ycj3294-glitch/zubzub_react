import styled from "styled-components";
import React from "react";
import { useNavigate } from "react-router-dom";

/* =====================
    Styled Components
===================== */
const Container = styled.div`
  max-width: 850px;
  margin: 30px auto;
  padding: 0 20px;
  background: #fff;
`;

/* ✅ 페이지 상단 타이틀 */
const MainTitle = styled.h1`
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 36px;
  margin-bottom: 20px;
  color: #000;
  letter-spacing: 1px;
`;

const IntegratedProfileBox = styled.div`
  border: 2px solid #000;
  border-radius: 20px;
  padding: 30px 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  background: #fff;
`;

const ProfileImgSection = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
  }
  .edit-icon {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: #000;
    color: #fff;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    border: 2px solid #fff;
    cursor: pointer;
  }
`;

const InfoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* ✅ 전체 정보를 오른쪽으로 당기기 위한 설정 */
  align-items: flex-end;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%; /* 전체 너비 사용 */
  justify-content: flex-end; /* ✅ 내부 요소를 오른쪽으로 정렬 */

  .label {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 16px;
    color: #000;
    text-align: right;
    width: 120px; /* 라벨 영역 확보 */
  }

  .divider {
    width: 1px;
    height: 14px;
    background: #eee;
    margin: 0 25px; /* 선 좌우 여백 확보 */
    flex-shrink: 0;
  }

  .value-area {
    width: 280px; /* ✅ 데이터 영역 너비를 고정하여 오른쪽 정렬 유지 */
    display: flex;
    align-items: center;
    justify-content: flex-start; /* 데이터는 왼쪽 정렬 */
  }

  .value {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #333;
  }

  input {
    width: 160px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 10px;
    font-family: "Noto Sans KR", sans-serif;
    font-size: 13px;
    outline: none;
  }
`;

const MiniBtn = styled.button`
  background: #666;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    background: #000;
  }
`;

const TopEditBtnWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const TopEditBtn = styled.button`
  background: #999;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
`;

/* --- 내역 섹션 --- */
const SectionTitle = styled.h2`
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 28px;
  margin: 40px 0 15px 0;
`;

const ListContainer = styled.div`
  border-top: 3px solid #000;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 10px;
  border-bottom: 1px solid #eee;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 800;
  &:last-child {
    border-bottom: 3px solid #000;
  }
  .item-title {
    font-size: 16px;
  }
  .item-date {
    font-size: 15px;
    color: #777;
  }
`;

const FooterLink = styled.div`
  text-align: center;
  margin: 50px 0;
  span {
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 900;
    font-size: 14px;
    border-bottom: 2px solid #000;
    padding-bottom: 3px;
    cursor: pointer;
  }
`;

/* =====================
    Component
===================== */
const MyPage = () => {
  const navigate = useNavigate();

  const historyData = Array(5).fill({
    title: "WHY? 책 상태 A급 20권 묶음 판매",
    date: "2025.12.15 - 17:03:42",
  });

  return (
    <Container>
      {/* 마이페이지 타이틀 */}
      <MainTitle>MY PAGE</MainTitle>

      {/* 1. 상단 통합 프로필 박스 (우측 정렬 강화) */}
      <IntegratedProfileBox>
        <ProfileImgSection>
          <img src="https://via.placeholder.com/200" alt="profile" />
          <div className="edit-icon" onClick={() => navigate("/edit-profile")}>
            ✎
          </div>
        </ProfileImgSection>

        <InfoContent>
          <InfoRow>
            <div className="label">이메일</div>
            <div className="divider" />
            <div className="value-area">
              <div className="value">55029564@gmail.com</div>
            </div>
          </InfoRow>
          <InfoRow>
            <div className="label">이름</div>
            <div className="divider" />
            <div className="value-area">
              <div className="value">이태수</div>
            </div>
          </InfoRow>
          <InfoRow>
            <div className="label">닉네임</div>
            <div className="divider" />
            <div className="value-area">
              <div className="value">LeeTS</div>
            </div>
          </InfoRow>
          <InfoRow>
            <div className="label">보유 줍코인</div>
            <div className="divider" />
            <div className="value-area">
              <div className="value">100,000 ZC</div>
            </div>
          </InfoRow>
          <InfoRow>
            <div className="label">충전할 줍코인</div>
            <div className="divider" />
            <div className="value-area">
              <input type="text" placeholder="충전 금액" />
              <MiniBtn>충전</MiniBtn>
            </div>
          </InfoRow>
        </InfoContent>
      </IntegratedProfileBox>

      <TopEditBtnWrap>
        <TopEditBtn onClick={() => navigate("/edit-profile")}>
          개인정보 수정
        </TopEditBtn>
      </TopEditBtnWrap>

      {/* 2. 내역 섹션 */}
      <SectionTitle>구매내역</SectionTitle>
      <ListContainer>
        {historyData.map((item, idx) => (
          <ListItem key={idx}>
            <div className="item-title">{item.title}</div>
            <div className="item-date">{item.date}</div>
          </ListItem>
        ))}
      </ListContainer>

      <SectionTitle>판매내역</SectionTitle>
      <ListContainer>
        {historyData.map((item, idx) => (
          <ListItem key={idx}>
            <div className="item-title">{item.title}</div>
            <div className="item-date">{item.date}</div>
          </ListItem>
        ))}
      </ListContainer>

      <FooterLink>
        <span onClick={() => navigate("/history/all")}>
          나의 전체 거래 자세히보기
        </span>
      </FooterLink>
    </Container>
  );
};

export default MyPage;
