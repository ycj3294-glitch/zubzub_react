import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Frame1 from "../images/Frame1.png";
import Frame2 from "../images/Frame2.png";
import TimerComponent from "../components/auction/TimerComponent";
import AxiosApi from "../api/AxiosAPI";
import ChatComponent from "../components/auction/ChatComponent";
import { useAuth } from "../context/AuthContext";

/* =========================
   Styled Components
========================= */

const MainContainer = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 40px 20px;
  font-family: "dnf bitbit v2", sans-serif;
  font-weight: normal;
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
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  margin-bottom: 50px;
`;

const MainBanner = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${Frame1}) no-repeat center/cover;
  height: 320px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  p {
    font-size: 13px;
    opacity: 0.8;
  }
`;

const ScheduleCard = styled.div`
  border: 1px solid #eee;
  border-radius: 15px;
  padding: 20px;
  background: #fff;
  height: 320px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 20px;
`;

const DayItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: ${(props) => (props.active ? "#000" : "#bbb")};
  cursor: pointer;
  text-decoration: ${(props) => (props.active ? "underline" : "none")};
  text-underline-offset: 4px;
  transition: all 0.2s ease;
  &:hover {
    color: #000;
  }
`;

const ScheduleItems = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  flex: 1;
`;

const ItemBox = styled.div`
  flex: 0 1 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .img-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8f8f8;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
    border: 1px solid #f0f0f0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  p {
    font-size: 12px;
    color: #333;
    margin: 0;
  }
`;

/* --- 섹션 2: 대규모 경매 (에러 발생했던 스타일들) --- */
const LargeAuctionContent = styled.div`
  display: flex;
  border: 1px solid #eee;
  border-radius: 15px;
  overflow: hidden;
  height: 350px;
  margin-bottom: 60px;
`;

const LargeImageArea = styled.div`
  flex: 1.5;
  position: relative;
  background: ${({ imgUrl }) =>
    imgUrl ? `url(${imgUrl}) no-repeat center / cover` : "#333"};
  border-radius: 15px 0 0 15px;
  overflow: hidden;

  @media (max-width: 768px) {
    background-size: contain;
    background-color: #000; /* 여백 생길 때 */
  }

  .timer-overlay {
    position: absolute;
    inset: 0; /* ← 이게 핵심: top/right/bottom/left = 0 */
    background: rgba(0, 0, 0, 0.55); /* 이미지 덮는 반투명 레이어 */
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    z-index: 1;
  }
`;

const LargeInfoArea = styled.div`
  flex: 1;
  padding: 25px 0 25px 25px;
  display: flex;
  flex-direction: column;
`;

// 컴포넌트 정의 확인
const InfoLabel = styled.div`
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

// 컴포넌트 정의 확인
const ChatPlaceholder = styled.div`
  height: calc(100% - 25px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  text-align: center;
  line-height: 1.6;
  font-size: 14px;
`;

/* --- 섹션 3: 소규모 경매 --- */
const SmallAuctionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 80px;
`;

const SmallItemCard = styled.div`
  text-align: center;

  .thumb {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    background: #f9f9f9;
    border: 1px solid #eee;
    background-image: url(${(props) => props.img});
    background-size: cover;
    background-position: center;
  }

  p {
    margin-top: 10px;
    font-size: 12px;
    color: #444;
  }
`;

/* --- 섹션 4: 안전거래 --- */
const SafetySection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(${Frame2}) no-repeat center/cover;
  padding: 60px 20px;
  border-radius: 20px;
  text-align: center;
`;

const SafetyTitleBox = styled.div`
  background: #fff;
  display: inline-block;
  padding: 8px 25px;
  border-radius: 30px;
  font-size: 16px;
  margin-bottom: 40px;
`;

const SafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const SafetyCard = styled.div`
  background: rgba(255, 255, 255, 0.92);
  padding: 25px 20px;
  border-radius: 15px;
  text-align: left;
  font-size: 11px;
  line-height: 1.7;
  .icon-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 13px;
    color: #000;
  }
`;

/* =========================
   MainPage Component
========================= */

const MainPage = () => {
  const nav = useNavigate();
  const [activeDate, setActiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  console.log(activeDate);
  const [mainAuction, setMainAuction] = useState();
  const [majorAuctions, setMajorAuctions] = useState();
  const [minorAuctions, setMinorAuctions] = useState();
  const { user } = useAuth();

  // const days = [12, 13, 14, 15, 16, 17, 18];
  const getNext7Days = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().split("T")[0]; // YYYY-MM-DD
    });
  };
  const days = getNext7Days(); // YYYY-MM-DD
  const getDateLabel = (date) => date.split("-")[2]; // DD

  useEffect(() => {
    const loadMainAuction = async () => {
      try {
        const auction = await AxiosApi.getNearestEnd();
        setMainAuction(auction ?? null);
        console.log("이미지 URL:", auction?.itemImg);
      } catch (error) {
        console.error("메인옥션 로드 실패", error);
        setMainAuction(null);
      }
    };

    loadMainAuction();
  }, []);

  useEffect(() => {
    const loadMajorAuctions = async (date) => {
      const auctions = await AxiosApi.getMajorAuctionsByDate(date);
      console.log("선택날짜옥션", auctions);
      setMajorAuctions(auctions);
    };
    loadMajorAuctions(activeDate);
  }, [activeDate]);

  useEffect(() => {
    const loadMinorAuctions = async () => {
      const auctions = await AxiosApi.getMinorAuctions(1, 10);
      console.log("마이너옥션", auctions.content);
      setMinorAuctions(auctions.content);
    };
    loadMinorAuctions();
  }, []);

  return (
    <MainContainer>
      <TopGrid>
        <MainBanner>
          <h3>“가치를 다시 줍다, 줍줍(ZubZub)”</h3>
          <p>안전하고 투명한 중고 경매 플랫폼을 지향합니다.</p>
        </MainBanner>

        <ScheduleCard>
          <SectionTitle
            style={{
              fontSize: "18px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            프리미엄 경매 일정
          </SectionTitle>
          <CalendarHeader>
            {days.map((date) => (
              <DayItem
                key={date}
                active={activeDate === date}
                onClick={() => setActiveDate(date)}
              >
                {getDateLabel(date)}일
              </DayItem>
            ))}
          </CalendarHeader>
          <ScheduleItems>
            {majorAuctions &&
              majorAuctions.slice(0, 3).map((item) => (
                <ItemBox
                  key={item.id}
                  onClick={() => nav(`/auction/major/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="img-wrapper">
                    <img src={item.itemImg} alt={item.itemName} />
                  </div>
                  <p>{item.itemName}</p>
                </ItemBox>
              ))}
          </ScheduleItems>
        </ScheduleCard>
      </TopGrid>

      <SectionTitle>프리미엄 경매</SectionTitle>

      <LargeAuctionContent>
        <LargeImageArea
          imgUrl={mainAuction?.itemImg}
          onClick={() => {
            if (!mainAuction) return;
            nav(`/auction/major/${mainAuction.id}`);
          }}
        >
          {mainAuction && (
            <div className="timer-overlay">
              <TimerComponent end={mainAuction.endTime} />
            </div>
          )}
        </LargeImageArea>

        <LargeInfoArea>
          <InfoLabel>현재 낙찰가 : {mainAuction?.finalPrice} 원</InfoLabel>

          <ChatPlaceholder>
            {mainAuction && (
              <ChatComponent
                chatId={mainAuction.id}
                nickname={user ? user.nickname : "익명"}
              />
            )}
          </ChatPlaceholder>
        </LargeInfoArea>
      </LargeAuctionContent>

      <SectionTitle>데일리 경매</SectionTitle>
      <SmallAuctionGrid>
        {minorAuctions &&
          minorAuctions.map((auction) => (
            <SmallItemCard
              key={auction.id}
              onClick={() => nav(`/auction/minor/${auction.id}`)}
              style={{ cursor: "pointer" }}
              img={auction.itemImg}
            >
              <div className="thumb"></div>
              <p>{auction.itemName}</p>
              <p>{auction.finalPrice}원</p>
            </SmallItemCard>
          ))}
      </SmallAuctionGrid>

      <SafetySection>
        <SafetyTitleBox>
          3단계로 보는 <b>줍줍 안전거래</b>
        </SafetyTitleBox>
        <SafetyGrid>
          <SafetyCard>
            <div className="icon-title">🛡️ 안전한 자산 관리</div>
            <p>1. 은행 시스템 연동을 통한 입금 확인</p>
            <p>2. 크레딧 즉시 지급 및 이력 관리</p>
          </SafetyCard>
          <SafetyCard>
            <div className="icon-title">✔️ 안전 거래 보장</div>
            <p>1. 낙찰 대금 에스크로 안전 보관</p>
            <p>2. 최종 확인 후 판매자 대금 정산</p>
          </SafetyCard>
          <SafetyCard>
            <div className="icon-title">📜 엄격한 거래 규칙</div>
            <p>1. 허위 매물 및 부정 행위 차단</p>
            <p>2. 모든 경매 프로세스 투명 공개</p>
          </SafetyCard>
        </SafetyGrid>
      </SafetySection>
    </MainContainer>
  );
};

export default MainPage;
