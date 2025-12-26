// MajorAuctionDetail.js (대규모 경매 상세 페이지 - 오른쪽 정보 밀도 개선)

import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AxiosApi, { getAuction, getUserInfo } from "../api/AxiosAPI";
import { connectBidBroadcast } from "../api/broadcast";
import TimerComponent from "../components/auction/TimerComponent";
import { useAuth } from "../context/AuthContext";
import CreateBidComponent from "../components/auction/CreateBidComponent";

/* =====================
   Dummy Data (유지)
===================== */

const DUMMY_AUCTION = {
  title: "WHY? 책 20권 묶음",
  startPrice: 30000,
  finalPrice: 40000,
  minBidUnit: 1000,
  bidCount: 0,
  endTime: "11:11:11",
  immediatePrice: "불가",
  myCredit: 50000,
  images: [
    "대규모 경매 페이지 1.jpg",
    "/images/major-thumb1.jpg",
    "/images/major-thumb2.jpg",
    "/images/major-thumb3.jpg",
    "/images/major-thumb4.jpg",
    "/images/major-thumb5.jpg",
  ],
  description: `상품 상태가 매우 희귀하여 최상급 컨디션을 유지하고 있습니다.
많은 20권에서 읽어짐, 외관 관리에 의한 얼룩, 불편함이 해변함을 이용한 칫솔 및 칫솔이 많이 없었습니다. 책은(책 윗부분) 또한 깔끔합니다.

[상품 특성]
만화적 특성을 활용하는 '손때나 오염된 흔적이 거의 없어 새 책과 비교해도 손색이 없을 정도입니다. 특별한 책 소장하고 싶은 분께 추천드립니다.

[배송 및 거래 안내]
배송료는 낙찰 후 구매자에게 부과되며, 사이트 정책에 따라 배송이 진행될 예정입니다.
본 상품은 거래 참여 후, 거래 이력 및 최종 낙찰 가격에 따라 거래가 이루어집니다. 게시된 상품의 궁금한 점이 있으시면 언제든지 문의 가능하며 판매 참여에 감사드립니다.`,

  notice: `1. 경매 가능 기간 및 조건
- 경매 참여는 만 14세 이상 구매자(회원)에 한하여 진행됩니다.
- 경매 종료 시간은 11:11:11 입니다.

2. 입찰 금액 제한
- 입찰은 최소 1000원 단위로 가능하며 현재가보다 높은 금액으로만 입찰 가능합니다.
- 입찰 후 취소 또는 변경은 절대 불가합니다.`,
  end: "2025-12-25T11:11:00",
};

/* =====================
   Styled Components (오른쪽 정보 개선)
===================== */

const Container = styled.div`
  max-width: 1100px;
  margin: 50px auto;
  padding: 0 16px;
`;

const AuctionTitle = styled.h1`
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 900;
  color: #000;
`;

const MainGrid = styled.div`
  display: flex;
  gap: 40px;
  padding-bottom: 40px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoSection = styled.div`
  flex: 1;
  /* 오른쪽에 빈 느낌이 나지 않도록 경계선 제거 및 패딩 조정 */
  padding: 0;
`;

/* ===== Image Area (유지) ===== */

const MainImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  margin-bottom: 20px;
`;

const ThumbRowWrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 0 40px;
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: scroll;
  padding-bottom: 5px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Thumb = styled.img`
  width: 65px;
  height: 65px;
  flex-shrink: 0;
  object-fit: cover;
  cursor: pointer;
  border: ${(props) => (props.$active ? "2px solid #000" : "1px solid #ddd")};
  box-sizing: border-box;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 10;
  font-size: 16px;
  font-weight: bold;

  ${(props) => (props.left ? "left: 0px;" : "right: 0px;")}
`;

/* ===== Info Area (오른쪽 정보) ===== */

const CurrentPrice = styled.p`
  font-size: 30px;
  font-weight: 900;
  color: #000;
  margin-bottom: 25px;
  text-align: left; /* 정렬 변경 */
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 16px;
  line-height: 2.2;
  margin-bottom: 30px;

  li {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
  }
  span:first-child {
    font-weight: 500;
  }
  span:last-child {
    font-weight: 900;
    color: #000;
  }
`;

const CreditBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
`;

/* ===== Q&A / 입찰 기록 탭 (유지) ===== */

const TabArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #000;
  margin-bottom: 40px;
`;

const Tab = styled.div`
  padding: 25px;
  text-align: center;
  border-right: 1px solid #000;

  &:last-child {
    border-right: none;
  }
`;

const TabTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const ChatInputRow = styled.div`
  display: flex;
  gap: 0;
  margin-top: 20px;
  border: 1px solid #000;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  font-size: 15px;
`;

const ChatButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: #000;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

/* ===== Detail Section (상품 설명/주의 사항) (유지) ===== */

const Section = styled.section`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 3px solid #000;
`;

const SectionContent = styled.p`
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
  padding: 10px 0;
`;

/* =====================
   Component
===================== */

const MajorAuctionDetail = () => {
  const { id: auctionId } = useParams();
  const [auction, setAuction] = useState(DUMMY_AUCTION);
  const [currentImg, setCurrentImg] = useState(0);
  const [bidPrice, setBidPrice] = useState(
    auction.finalPrice + auction.minBidUnit
  );
  const [end, setEnd] = useState("");
  const { isLogin, user } = useAuth();
  const [credit, setCredit] = useState(0);

  useEffect(() => {
    if (!user) return;
    const loadCredit = async () => {
      console.log(user);
      const { data } = await AxiosApi.getUserInfo(user.id);
      setCredit(data.credit);
    };
    loadCredit();
  }, [user, auction]);

  useEffect(() => {
    const loadAuction = async () => {
      const res = await getAuction(auctionId);
      setAuction(res);
    };
    loadAuction();

    connectBidBroadcast(auctionId, (auction) => {
      setAuction((prev) => ({ ...prev, ...auction }));
      console.log("경매 업데이트:", auction);
    });
  }, [auctionId]);

  useEffect(() => {
    if (!auction) return;
    if (new Date() < new Date(auction.startTime)) setEnd(auction.startTime);
    else if (auction.extendedEndTime) setEnd(auction.extendedEndTime);
    else setEnd(auction.endTime);
  }, [auction]);

  return (
    <Container>
      <AuctionTitle>WHY? 책 20권 묶음</AuctionTitle>

      <MainGrid>
        {/* 1. 이미지 섹션 */}
        <ImageSection>
          <MainImage src={auction.itemImg} alt={auction.title} />

          {/* <ThumbRowWrapper>
            <Arrow
              left
              onClick={() =>
                setCurrentImg((prev) =>
                  prev === 0 ? auction.images.length - 1 : prev - 1
                )
              }
            >
              ‹
            </Arrow>
            <Arrow
              onClick={() =>
                setCurrentImg((prev) =>
                  prev === auction.images.length - 1 ? 0 : prev + 1
                )
              }
            >
              ›
            </Arrow>
            <ThumbRow>
              {auction.images.map((img, idx) => (
                <Thumb
                  key={idx}
                  src={img}
                  $active={idx === currentImg}
                  onClick={() => setCurrentImg(idx)}
                />
              ))}
            </ThumbRow>
          </ThumbRowWrapper> */}
        </ImageSection>

        {/* 2. 정보 및 입찰 섹션 (오른쪽 빈 공간 개선) */}
        <InfoSection>
          <CurrentPrice>현재가 {auction.finalPrice} 원</CurrentPrice>

          <InfoList>
            <li>
              <span>남은 시간</span>{" "}
              <span>
                <TimerComponent end={auction.endTime} />
              </span>
            </li>
            <li>
              <span>입찰 횟수</span> <span>{auction.bidCount}회</span>
            </li>
            <li>
              <span>입찰 단위</span> <span>{auction.minBidUnit}원</span>
            </li>
            <li>
              <span>즉시 구매</span> <span>{auction.immediatePrice}</span>
            </li>
          </InfoList>

          {isLogin && (
            <CreditBox>
              <span>내 보유 크레딧</span> <span>{credit}원</span>
            </CreditBox>
          )}

          {/* 가이드 이미지와 유사하게 '입찰금액 입력' 텍스트를 하나의 컴포넌트로 표현 */}
          {isLogin && (
            <CreateBidComponent
              auctionId={auctionId}
              finalPrice={auction.finalPrice}
              minBidUnit={auction.minBidUnit}
              bidderId={user.id}
              style={{ marginTop: "20px" }}
            ></CreateBidComponent>
          )}
        </InfoSection>
      </MainGrid>

      {/* 3. 실시간 Q&A 및 입찰 기록 탭 */}
      <TabArea>
        <Tab>
          <TabTitle>판매자와 구매자의 실시간 질의 응답</TabTitle>
          <ChatInputRow>
            <ChatInput type="text" placeholder="TEXT" />
            <ChatButton>입력</ChatButton>
          </ChatInputRow>
        </Tab>
        <Tab style={{ borderRight: "none" }}>
          <TabTitle>입찰 기록</TabTitle>
          <SectionContent
            style={{ textAlign: "center", marginTop: "30px", color: "#999" }}
          >
            <p>최근 입찰 기록이 없습니다.</p>
          </SectionContent>
        </Tab>
      </TabArea>

      {/* 4. 상품 설명 */}
      <Section>
        <SectionTitle>상품 설명</SectionTitle>
        <SectionContent>{auction.description}</SectionContent>
      </Section>

      {/* 5. 주의 사항 */}
      <Section>
        <SectionTitle>주의 사항</SectionTitle>
        <SectionContent>{auction.notice}</SectionContent>
      </Section>
    </Container>
  );
};

export default MajorAuctionDetail;
