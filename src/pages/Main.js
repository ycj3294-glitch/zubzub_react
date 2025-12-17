import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Frame1 from "../Images/Frame1.png";
import Frame2 from "../Images/Frame2.png";

/* --- 전역 스타일 --- */
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #fff;
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
`;

/* =========================
   Styled Components
========================= */

const MainContainer = styled.main`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: "dnf bitbit v2", sans-serif;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  color: #000;
  font-weight: normal;
`;

/* --- 섹션 1: 상단 그리드 --- */
const TopGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 20px;
  margin-bottom: 60px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  border-bottom: 2px solid #f5f5f5;
  padding-bottom: 15px;
  margin-bottom: 25px;
`;

const DayItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  color: ${(props) => (props.active ? "#000" : "#ccc")};
  cursor: pointer;
  position: relative;
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
  gap: 20px;
  flex: 1;
  align-items: center;
`;

const ItemBox = styled.div`
  flex: 1;
  max-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .img-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8f8f8;
    border-radius: 12px;
    border: 1px solid #eee;
  }
  p {
    font-size: 13px;
    color: #222;
    margin-top: 8px;
  }
`;

/* --- 섹션 2: 대규모 경매 --- */
const LargeAuctionContent = styled.div`
  display: flex;
  border: 1px solid #eee;
  border-radius: 15px;
  overflow: hidden;
  height: 400px;
  margin-bottom: 60px;
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LargeImageArea = styled.div`
  flex: 0.7;
  background: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  border-right: 1px solid #eee;
  @media (max-width: 768px) {
    height: 250px;
    border-right: none;
    border-bottom: 1px solid #eee;
  }
`;

const LargeInfoArea = styled.div`
  flex: 1.3;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: #fff;
`;

const ChatBox = styled.div`
  flex: 1;
  background: #fdfdfd;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const ChatMessage = styled.div`
  font-size: 13px;
  color: #555;
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  width: fit-content;
`;

/* --- 섹션 3: 소규모 경매 (반응형 그리드 최적화) --- */
const SmallAuctionGrid = styled.div`
  display: grid;
  /* 데스크탑 3열 고정 */
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  max-width: 900px;
  margin: 0 auto 80px auto;

  /* 태블릿/모바일 2열 고정 */
  @media (max-width: 850px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 600px;
  }
`;

const SmallItemCard = styled.div`
  text-align: center;
  .thumb {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    background: #f9f9f9;
    border: 1px solid #eee;
  }
  p {
    margin-top: 12px;
    font-size: 14px;
    color: #333;
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
`;

const SafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
    word-break: keep-all;
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
  const [activeDay, setActiveDay] = useState(14);
  const [itemCount, setItemCount] = useState(9); // 기본 9개 (3x3)

  // 화면 크기에 따라 아이템 개수를 조절하여 홀수 방지
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 850) {
        setItemCount(8); // 모바일/태블릿 2열일 때는 8개 (2x4)
      } else {
        setItemCount(9); // 데스크탑 3열일 때는 9개 (3x3)
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const days = [12, 13, 14, 15, 16, 17, 18];
  const auctionData = {
    12: [
      { id: 1, name: "빈티지 시계" },
      { id: 2, name: "LP 플레이어" },
      { id: 3, name: "헤드폰" },
    ],
    13: [
      { id: 1, name: "노트북" },
      { id: 2, name: "기계식 키보드" },
      { id: 3, name: "마우스" },
    ],
    14: [
      { id: 1, name: "일렉기타" },
      { id: 2, name: "카메라" },
      { id: 3, name: "트럼펫" },
    ],
    15: [
      { id: 1, name: "스니커즈" },
      { id: 2, name: "가죽 자켓" },
      { id: 3, name: "선글라스" },
    ],
    16: [
      { id: 1, name: "텐트" },
      { id: 2, name: "캠핑 의자" },
      { id: 3, name: "코벨" },
    ],
    17: [
      { id: 1, name: "소파" },
      { id: 2, name: "무드등" },
      { id: 3, name: "러그" },
    ],
    18: [
      { id: 1, name: "자전거" },
      { id: 2, name: "스케이트보드" },
      { id: 3, name: "전동휠" },
    ],
  };

  return (
    <>
      <GlobalStyle />
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
              {auctionData[activeDay].map((item) => (
                <ItemBox key={item.id}>
                  <div className="img-wrapper"></div>
                  <p>{item.name}</p>
                </ItemBox>
              ))}
            </ScheduleItems>
          </ScheduleCard>
        </TopGrid>

        <SectionTitle>대규모 경매</SectionTitle>
        <LargeAuctionContent>
          <LargeImageArea>경매 중인 이미지</LargeImageArea>
          <LargeInfoArea>
            <div style={{ fontSize: "15px", marginBottom: "10px" }}>
              현재 최고가:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#e74c3c",
                }}
              >
                150,000원
              </span>
            </div>
            <ChatBox>
              <ChatMessage>사용자1: 140,000원 입찰합니다!</ChatMessage>
              <ChatMessage>사용자2: 혹시 정품 보증서 있나요?</ChatMessage>
              <ChatMessage>관리자: 네, 구성품에 포함되어 있습니다.</ChatMessage>
            </ChatBox>
          </LargeInfoArea>
        </LargeAuctionContent>

        <SectionTitle>소규모 경매</SectionTitle>
        <SmallAuctionGrid>
          {[...Array(itemCount)].map((_, i) => (
            <SmallItemCard key={i}>
              <div className="thumb"></div>
              <p>상품명 및 입찰가</p>
            </SmallItemCard>
          ))}
        </SmallAuctionGrid>

        <SafetySection>
          <SafetyTitleBox>줍줍(ZubZub)의 신뢰를 위한 약속</SafetyTitleBox>
          <SafetyGrid>
            <SafetyCard>
              <div className="icon-title">🛡️ 안전 자산 관리</div>
              <p>
                운영팀이 모든 입금을 2단계 확인 후 크레딧으로 지급합니다. 자산
                보호와 보안 강화를 위한 필수 절차입니다.
              </p>
              <p className="footer-note">[마이페이지]에서 실시간 확인 가능.</p>
            </SafetyCard>
            <SafetyCard>
              <div className="icon-title">✔️ 안전 거래 보장</div>
              <p>
                결제 대금은 구매 확정 시까지 에스크로에 안전하게 보관됩니다.
                사기 및 문제 상품으로부터 100% 보호받으세요.
              </p>
            </SafetyCard>
            <SafetyCard>
              <div className="icon-title">📜 투명한 운영 규정</div>
              <p>
                허위 매물 및 비매너 행위는 즉시 제재합니다. 모든 거래는 투명한
                가이드에 따라 클린하게 관리됩니다.
              </p>
            </SafetyCard>
          </SafetyGrid>
        </SafetySection>
      </MainContainer>
    </>
  );
};

export default MainPage;
