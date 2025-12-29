import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosAPI";
import { connectBidBroadcast } from "../api/broadcast";
import { useAuth } from "../context/AuthContext";

// 공통 컴포넌트
import TimerComponent from "../components/auction/TimerComponent";
import CreateBidComponent from "../components/auction/CreateBidComponent";
import ChatComponent from "../components/auction/ChatComponent";
import BidHistoryComponent from "../components/auction/BidHistoryComponent";

/* =====================
   Styled Components (원본 디자인 복구 완료)
===================== */
const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: "Pretendard", -apple-system, sans-serif;
  color: #1a1a1a;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #d4af37; /* 골드 라인 복구 */
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin: 0;
`;

const PremiumBadge = styled.div`
  /* 그라데이션 뱃지 복구 */
  background: linear-gradient(135deg, #d4af37 0%, #f9f295 50%, #b8860b 100%);
  color: #000;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ConsistentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 25px;
  margin-bottom: 30px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainImageWrap = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const SliderArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: #d4af37;
  border: 1px solid #d4af37;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  &:hover {
    background: #d4af37;
    color: #000;
  }
  ${(props) => (props.$left ? "left: 15px;" : "right: 15px;")}
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Thumb = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: ${(props) =>
    props.$active ? "3px solid #d4af37" : "1px solid #ddd"};
  transition: 0.2s;
  flex-shrink: 0;
`;

const InfoBox = styled.div`
  border: 2px solid #d4af37; /* 골드 테두리 복구 */
  border-radius: 12px;
  padding: 30px;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const PriceArea = styled.div`
  margin-bottom: 25px;
  .label {
    font-size: 14px;
    color: #888;
    margin-bottom: 6px;
    font-weight: 600;
  }
  .price {
    font-size: 38px;
    font-weight: 900;
    color: #000;
  }
  .unit {
    font-size: 20px;
    margin-left: 5px;
    color: #d4af37;
  }
`;

const WalletBox = styled.div`
  background: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
`;

const WalletRow = styled.div`
  flex-direction: column; /* 세로 배치 */
  gap: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #aaa;
  margin-bottom: 10px;
  .val {
    color: #fff;
    font-weight: 700;
  }
  .highlight {
    color: #f9f295;
    font-weight: 800;
    font-size: 16px;
  }

  &.divider {
    border-top: 1px dashed #444;
    padding-top: 12px;
    margin-top: 5px;
  }
  .label-gold {
    color: #d4af37;
    font-weight: 800;
  }
`;

const InfoList = styled.div`
  padding: 15px 0;
  border-top: 1px solid #eee;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  .key {
    color: #666;
  }
  .value {
    font-weight: 700;
  }
`;

/* ===== Q&A 및 입찰 기록 보드 (수정됨) ===== */
const Board = styled.div`
  /* 기존 테두리 제거 (내부 컴포넌트인 ChatComponent가 테두리를 가짐) */
  /* 단, 배경색이나 위치는 잡아줌 */
  height: 450px;
  display: flex;
  flex-direction: column;
  background: transparent;
  /* 채팅창의 둥근 모서리가 잘리지 않도록 함 */
`;

const BoardHeader = styled.div`
  background: #000;
  color: #d4af37;
  padding: 15px 20px;
  font-size: 15px;
  font-weight: 800;

  /* [핵심] 윗부분만 둥글게 처리 (라디오 스타일 상단) */
  border-radius: 15px 15px 0 0;

  /* 테두리도 ChatComponent와 이어지도록 설정 */
  border: 1px solid #000;
  border-bottom: none; /* 아래쪽 채팅창과 연결 */

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* ChatComponent(라디오 하단)를 감싸는 래퍼 - 꽉 차게 하기 위함 */
const ChatWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  /* ChatComponent가 100% 크기를 가지므로 여기서 제어 */
  & > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none; /* 헤더와 겹치는 선 제거 */
  }
`;

/* 입찰 기록용 바디 (채팅창과 디자인 통일) */
const BoardBody = styled.div`
  flex: 1;
  background: #fff;
  border: 1px solid #000;
  border-top: none;
  /* 아래쪽만 둥글게 */
  border-radius: 0 0 15px 15px;
  overflow: hidden;
`;

/* ===== 하단 가이드 섹션 (원본 유지) ===== */
const Section = styled.section`
  margin-top: 50px;
`;
const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 20px;
  border-left: 5px solid #d4af37;
  padding-left: 15px;
`;

const Description = styled.div`
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  padding: 30px;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 12px;
  white-space: pre-line;
`;

/* =====================
   Main Component
===================== */

const MajorAuctionDetail = () => {
  const { id: auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const { isLogin, user } = useAuth();

  const [userCredit, setUserCredit] = useState(0);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await AxiosApi.getAuction(auctionId);
        if (res && res.data) {
          setAuction(res.data);
        }
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      }
    };
    if (auctionId) fetchAuction();

    connectBidBroadcast(auctionId, (updated) => {
      setAuction((prev) => ({ ...prev, ...updated }));
    });
  }, [auctionId]);

  useEffect(() => {
    if (user?.id) {
      AxiosApi.getUserInfo(user.id).then((res) => {
        if (res?.data) setUserCredit(res.data.credit);
      });
    }
  }, [user, auction]);

  if (!auction) return <Container>데이터를 불러오는 중입니다...</Container>;

  const images =
    auction.itemImgs && auction.itemImgs.length > 0
      ? auction.itemImgs
      : [auction.itemImg];

  return (
    <Container>
      <Header>
        <Title>{auction.itemName}</Title>
        <PremiumBadge>PREMIUM AUCTION</PremiumBadge>
      </Header>

      <ConsistentGrid>
        {/* 이미지 섹션 */}
        <ImageSection>
          <MainImageWrap>
            {images.length > 1 && (
              <>
                <SliderArrow
                  $left
                  onClick={() =>
                    setCurrentImgIdx(
                      (p) => (p - 1 + images.length) % images.length
                    )
                  }
                >
                  &lt;
                </SliderArrow>
                <SliderArrow
                  onClick={() =>
                    setCurrentImgIdx((p) => (p + 1) % images.length)
                  }
                >
                  &gt;
                </SliderArrow>
              </>
            )}
            <MainImage src={images[currentImgIdx]} alt="Main" />
          </MainImageWrap>
          <ThumbRow>
            {images.map((img, idx) => (
              <Thumb
                key={idx}
                src={img}
                $active={idx === currentImgIdx}
                onClick={() => setCurrentImgIdx(idx)}
              />
            ))}
          </ThumbRow>
        </ImageSection>

        {/* 정보 박스 */}
        <InfoBox>
          <PriceArea>
            <div className="label">시작 가격</div>
            <div className="price">
              {(auction.startPrice || 0).toLocaleString()}
              <span className="unit">ZC</span>
            </div>
          </PriceArea>

          <WalletBox>
            <WalletRow>
              <span>내 보유 코인</span>
              <span className="val">{userCredit.toLocaleString()} ZC</span>
            </WalletRow>

            <WalletRow className="divider">
              {/* 첫 줄: 현재 최고 입찰가 + 금액 */}
              <div className="price-row">
                <span className="label-gold">현재 최고 입찰가 : </span>
                <span className="highlight">
                  {(
                    auction.finalPrice ||
                    auction.startPrice ||
                    0
                  ).toLocaleString()}{" "}
                  ZC
                </span>
              </div>

              {/* 두 번째 줄: 현재 최고 입찰자 */}
              <span className="label-gold">
                현재 최고 입찰자 : {auction.winnerNickname || "없음"}
              </span>
            </WalletRow>
          </WalletBox>

          <InfoList>
            <InfoItem>
              <span className="key">판매자</span>
              <span className="value">{auction.sellerNickname}</span>
            </InfoItem>
            <InfoItem>
              <span className="key">남은 시간</span>
              <span className="value" style={{ color: "#d32f2f" }}>
                <TimerComponent
                  end={
                    auction.extendedEndTime
                      ? auction.extendedEndTime
                      : auction.endTime
                  }
                />
              </span>
            </InfoItem>
            <InfoItem>
              <span className="key">입찰 단위</span>
              <span className="value">
                {(auction.minBidUnit || auction.bidUnit || 0).toLocaleString()}{" "}
                ZC
              </span>
            </InfoItem>
            <InfoItem>
              <span className="key">입찰 횟수</span>
              <span className="value">{auction.bidCount || 0}회</span>
            </InfoItem>
          </InfoList>

          <div style={{ marginTop: "auto" }}>
            <CreateBidComponent
              auctionId={auctionId}
              finalPrice={auction.currentPrice || auction.startPrice}
              minBidUnit={auction.minBidUnit || auction.bidUnit}
              bidderId={user?.id}
            />
          </div>
        </InfoBox>
      </ConsistentGrid>

      {/* 하단: 채팅 및 입찰 기록 */}
      <ConsistentGrid>
        <Board>
          <BoardHeader>
            실시간 Q&A <span>• Live</span>
          </BoardHeader>
          <ChatWrapper>
            {/* 방금 만든 '상단 0, 하단 15px' 라디오 스타일 ChatComponent가 들어감 */}
            <ChatComponent
              chatId={auctionId}
              nickname={user?.nickname || "익명"}
            />
          </ChatWrapper>
        </Board>

        <Board>
          <BoardHeader>입찰 기록</BoardHeader>
          <BoardBody>
            <BidHistoryComponent auctionId={auctionId} />
          </BoardBody>
        </Board>
      </ConsistentGrid>

      {/* 가이드 섹션 */}
      <Section>
        <SectionTitle>상품 상세 정보</SectionTitle>
        <Description>{auction.itemDesc || "상세 정보가 없습니다."}</Description>
      </Section>

      <Section>
        <SectionTitle>프리미엄 경매 참여 가이드</SectionTitle>
        <Description>
          {`프리미엄 경매 진행 방식 안내 (실시간 입찰)

프리미엄 경매는 실시간 최고가 경쟁 방식으로 진행됩니다. 아래 내용을 반드시 확인하신 후 참여해 주세요.

실시간 입찰이란?

입찰 금액은 모든 참가자에게 즉시 반영됩니다.

다른 참가자의 입찰 금액도 실시간으로 확인할 수 있습니다.

현재 최고가에 따라 경매가 진행되며, 최고 입찰자가 계속 표시됩니다.

입찰 시간

각 경매는 정해진 시작 시간부터 종료 시간까지 입찰이 가능합니다.

종료 시각 이후에는 추가 입찰이 불가능합니다.

낙찰 기준

경매 종료 시점에 가장 높은 금액을 제시한 참가자가 낙찰됩니다.

동일 금액 입찰 시, 먼저 입찰한 참가자가 우선 낙찰됩니다.

⚠ 유의사항

입찰 후 취소 또는 금액 변경은 불가능합니다.

허위 입찰 또는 부정 행위가 확인될 경우, 서비스 이용이 제한될 수 있습니다.

시스템 사정에 따라 경매 일정이 변경될 수 있으며, 변경 시 별도 공지로 안내드립니다.`}
        </Description>
      </Section>
    </Container>
  );
};

export default MajorAuctionDetail;
