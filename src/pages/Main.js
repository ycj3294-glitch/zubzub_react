import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Frame1 from "../Images/Frame1.png";
import Frame2 from "../Images/Frame2.png";

/* =========================
   Styled Components
========================= */

const MainContainer = styled.main`
  width: 100%;
  max-width: 1200px; /* 웹 사이즈 절대 유지 */
  margin: 0 auto;
  padding: 20px;
  font-family: "dnf bitbit v2", sans-serif;
  font-weight: normal;
  box-sizing: border-box; /* 패딩으로 인한 가로 스크롤 방지 */
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  color: #000;
  font-weight: normal;
  @media (max-width: 768px) {
    font-size: 18px; /* 모바일 제목 살짝 축소 */
  }
`;

/* --- 섹션 1: 상단 그리드 --- */
const TopGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.6fr; /* 웹 비율 유지 */
  gap: 20px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 모바일 세로 정렬 */
    margin-bottom: 40px;
  }
`;

const MainBanner = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${Frame1}) no-repeat center/cover;
  height: 350px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  padding: 0 20px;

  h3 {
    font-size: 24px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  p {
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.6;
    word-break: keep-all;
  }

  @media (max-width: 768px) {
    height: 250px;
    h3 {
      font-size: 20px;
    }
    p {
      font-size: 12px;
    }
  }
`;

const ScheduleCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 30px;
  background: #fff;
  height: 350px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 20px 15px;
    height: auto;
    min-height: 300px;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  border-bottom: 2px solid #f5f5f5;
  padding-bottom: 15px;
  margin-bottom: 25px;

  /* 모바일 가로 스크롤 최적화 */
  @media (max-width: 768px) {
    gap: 20px;
    justify-content: flex-start;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
    padding-left: 5px;
  }
`;

const DayItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  color: ${(props) => (props.active ? "#000" : "#ccc")};
  cursor: pointer;
  position: relative;
  min-width: 45px;
  &::after {
    content: "";
    display: ${(props) => (props.active ? "block" : "none")};
    width: 100%;
    height: 2px;
    background: #000;
    position: absolute;
    bottom: -17px;
  }
`;

const ScheduleItems = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  flex: 1;
  align-items: center;
`;

const ItemBox = styled.div`
  flex: 1;
  max-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .img-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8f8f8;
    border-radius: 12px;
    border: 1px solid #eee;
    transition: all 0.2s ease;
  }

  &:hover .img-wrapper {
    border-color: #000;
    transform: translateY(-3px);
  }

  p {
    font-size: 13px;
    color: #222;
    margin-top: 8px;
    text-align: center;
  }
  @media (max-width: 768px) {
    p {
      font-size: 11px;
    }
  }
`;

/* --- 섹션 2: 대규모 경매 --- */
const LargeAuctionContent = styled.div`
  display: flex;
  border: 1px solid #eee;
  border-radius: 15px;
  overflow: hidden;
  height: 350px;
  margin-bottom: 60px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    margin-bottom: 40px;
  }
`;

const LargeImageArea = styled.div`
  flex: 1.5;
  background: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  @media (max-width: 768px) {
    height: 220px;
  }
`;

const LargeInfoArea = styled.div`
  flex: 1;
  padding: 25px;
  background: #fff;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

/* --- 섹션 3: 소규모 경매 --- */
const SmallAuctionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 웹 5열 유지 */
  gap: 20px;
  margin-bottom: 80px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr); /* 모바일 가로스크롤 방지 2열 */
    gap: 15px;
    margin-bottom: 50px;
  }
`;

const SmallItemCard = styled.div`
  text-align: center;
  cursor: pointer;

  .thumb {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    background: #f9f9f9;
    border: 1px solid #eee;
    transition: all 0.2s ease;
  }

  &:hover .thumb {
    border-color: #000;
    transform: translateY(-5px);
  }

  p {
    margin-top: 10px;
    font-size: 12px;
  }
`;

/* --- 섹션 4: 안전거래 --- */
const SafetySection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${Frame2}) no-repeat center/cover;
  padding: 50px 20px;
  border-radius: 20px;
  text-align: center;
  margin-top: 50px;
  color: #fff;
  @media (max-width: 768px) {
    padding: 40px 15px;
    margin-top: 30px;
  }
`;

const SafetyTitleBox = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  display: inline-block;
  padding: 12px 40px;
  border-radius: 5px;
  font-size: 19px;
  margin-bottom: 40px;
  font-weight: normal;
  @media (max-width: 768px) {
    font-size: 15px;
    width: 90%;
    padding: 10px 0;
    box-sizing: border-box;
  }
`;

const SafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const SafetyCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: left;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  @media (max-width: 768px) {
    min-height: auto;
  }

  .icon-title {
    font-size: 14px;
    color: #fff;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 8px;
  }

  p {
    font-size: 12px;
    color: #ddd;
    line-height: 1.6;
    margin: 0;
  }
  .footer-note {
    margin-top: auto;
    padding-top: 10px;
    font-size: 10.5px;
    color: #bbb;
    border-top: 1px dashed rgba(255, 255, 255, 0.15);
  }
`;

/* =========================
   MainPage Component
========================= */

const MainPage = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(14);
  const days = [12, 13, 14, 15, 16, 17, 18];

  const auctionData = {
    12: [
      { id: "1", name: "빈티지 시계" },
      { id: "2", name: "LP 플레이어" },
      { id: "3", name: "헤드폰" },
    ],
    13: [
      { id: "4", name: "노트북" },
      { id: "5", name: "기계식 키보드" },
      { id: "6", name: "마우스" },
    ],
    14: [
      { id: "7", name: "일렉기타" },
      { id: "8", name: "카메라" },
      { id: "9", name: "트럼펫" },
    ],
    15: [
      { id: "10", name: "스니커즈" },
      { id: "11", name: "가죽 자켓" },
      { id: "12", name: "선글라스" },
    ],
    16: [
      { id: "13", name: "텐트" },
      { id: "14", name: "캠핑 의자" },
      { id: "15", name: "코벨" },
    ],
    17: [
      { id: "16", name: "소파" },
      { id: "17", name: "무드등" },
      { id: "18", name: "러그" },
    ],
    18: [
      { id: "19", name: "자전거" },
      { id: "20", name: "스케이트보드" },
      { id: "21", name: "전동휠" },
    ],
  };

  return (
    <MainContainer>
      <TopGrid>
        <MainBanner>
          <h3>“가치를 다시 줍다, 줍줍(ZubZub)”</h3>
          <p>안전하고 투명한 중고 경매 플랫폼을 지향합니다.</p>
        </MainBanner>
        <ScheduleCard>
          <CalendarHeader>
            {days.map((day) => (
              <DayItem
                key={day}
                active={activeDay === day}
                onClick={() => setActiveDay(day)}
              >
                {day}일
              </DayItem>
            ))}
          </CalendarHeader>
          <ScheduleItems>
            {(auctionData[activeDay] || []).map((item) => (
              <ItemBox
                key={item.id}
                onClick={() => navigate(`/auction/major/${item.id}`)}
              >
                <div className="img-wrapper"></div>
                <p>{item.name}</p>
              </ItemBox>
            ))}
          </ScheduleItems>
        </ScheduleCard>
      </TopGrid>

      <SectionTitle>대규모 경매</SectionTitle>
      <LargeAuctionContent onClick={() => navigate(`/auction/major/1`)}>
        <LargeImageArea>실시간 경매 중</LargeImageArea>
        <LargeInfoArea>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>
            실시간 입찰 가능 상품
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            채팅참여 및 상세보기를 위해 클릭하세요.
          </p>
        </LargeInfoArea>
      </LargeAuctionContent>

      <SectionTitle>소규모 경매</SectionTitle>
      <SmallAuctionGrid>
        {[...Array(10)].map((_, i) => {
          const itemId = i + 1; // 1부터 시작하는 ID
          return (
            <SmallItemCard
              key={itemId}
              onClick={() => navigate(`/auction/minor/${itemId}`)}
            >
              <div className="thumb"></div>
              <p>최소 입찰가 10,000원</p>
            </SmallItemCard>
          );
        })}
      </SmallAuctionGrid>

      <SafetySection>
        <SafetyTitleBox>줍줍(ZubZub)의 신뢰를 위한 약속</SafetyTitleBox>
        <SafetyGrid>
          <SafetyCard>
            <div className="icon-title">🛡️ 안전 자산 관리</div>
            <p>운영팀이 모든 입금을 2단계 확인 후 크레딧으로 지급합니다.</p>
            <p className="footer-note">[마이페이지]에서 확인 가능.</p>
          </SafetyCard>
          <SafetyCard>
            <div className="icon-title">✔️ 안전 거래 보장</div>
            <p>결제 대금은 구매 확정 시까지 에스크로에 안전하게 보관됩니다.</p>
          </SafetyCard>
          <SafetyCard>
            <div className="icon-title">📜 투명한 운영 규정</div>
            <p>허위 매물 및 비매너 행위는 즉시 제재하며 투명하게 관리됩니다.</p>
          </SafetyCard>
        </SafetyGrid>
      </SafetySection>
    </MainContainer>
  );
};

export default MainPage;
