// MajorAuction.js (대규모 경매 목록 페이지)

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/* =========================
   Dummy Data (하루 3개 경매, 여러 날짜 데이터)
========================= */

const today = new Date();
const formatDate = (date) => `${date.getMonth() + 1}.${date.getDate()}`;

const getAuctionDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// 상단 날짜 캘린더용 데이터 (오늘 포함 7일)
const DATE_DATA = Array.from({ length: 7 }, (_, i) => ({
  day: getAuctionDate(i).getDate(),
  date: `${getAuctionDate(i).getMonth() + 1}.${getAuctionDate(i).getDate()}`,
  name: ["12일", "13일", "14일", "15일", "16일", "17일", "18일"][i],
}));

// 경매 목록 데이터 (각 날짜별 3개 경매를 가정)
const AUCTION_LIST = [
  {
    id: 1,
    title: "WHY? 책 20권 묶음",
    image: "/images/major_why.jpg", // 가이드 이미지
    currentPrice: 40000,
    remainTime: "11:11:11",
    bidCount: 0,
    bidUnit: 1000,
    immediateBuy: "불가",
    status: "진행 중",
  },
  {
    id: 2,
    title: "트럼펫 (2경매)",
    image: "/images/major_trumpet.jpg",
    currentPrice: 0,
    remainTime: "00:00:00",
    bidCount: 0,
    bidUnit: 0,
    immediateBuy: "불가",
    status: "시작 안함",
  },
  {
    id: 3,
    title: "카메라 (3경매)",
    image: "/images/major_camera.jpg",
    currentPrice: 0,
    remainTime: "00:00:00",
    bidCount: 0,
    bidUnit: 0,
    immediateBuy: "불가",
    status: "시작 안함",
  },
];

/* =========================
   Styled Components (가이드 이미지 기반)
========================= */

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 50px auto;
  padding: 0 16px;
`;

const PageHeader = styled.h2`
  font-size: 32px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 40px;
  color: #000;
`;

/* --- 캘린더 / 날짜 헤더 --- */

const DateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
`;

const DateItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 15px 0;
  font-size: 18px;
  font-weight: ${({ $active }) => ($active ? "900" : "600")};
  color: ${({ $active }) => ($active ? "#000000ff" : "#000")};
  cursor: pointer;
  border-right: 1px solid #ddd;

  &:last-child {
    border-right: none;
  }
`;

/* --- 경매 목록 스타일 --- */

const AuctionWrapper = styled.div`
  margin-bottom: 50px;
`;

const AuctionItem = styled.div`
  display: flex;
  margin-top: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;

  &:first-child {
    border-top: 1px solid #eee;
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  width: 300px;
  position: relative;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const AuctionImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
`;

const StatusOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $show }) => ($show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding-left: 30px;

  @media (max-width: 600px) {
    padding-left: 0;
  }
`;

const AuctionNumber = styled.p`
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 10px;
  color: #000;
`;

const InfoRow = styled.div`
  margin-top: 20px;
`;

const InfoText = styled.p`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.8;
  color: #000;

  span {
    font-weight: 900;
    color: #000000ff;
  }
`;

/* =========================
   Component
========================= */

const MajorAuction = () => {
  const nav = useNavigate();
  const [activeDate, setActiveDate] = useState(DATE_DATA[4].name); // 16일 (5번째)을 기본 활성화로 가정

  // 현재 활성화된 날짜에 따라 경매 목록을 필터링하는 로직 (더미이므로 모든 날짜에 동일 목록 표시)
  const displayList = AUCTION_LIST;

  const handleItemClick = (id) => {
    // 가이드 이미지 1 상세 페이지로 이동
    nav(`/auction/major/${id}`);
  };

  return (
    <Container>
      <PageHeader>대규모 경매</PageHeader>

      {/* 캘린더/날짜 헤더 */}
      <DateHeader>
        {DATE_DATA.map((item, index) => (
          <DateItem
            key={index}
            $active={item.name === activeDate}
            onClick={() => setActiveDate(item.name)}
          >
            {item.name}
          </DateItem>
        ))}
      </DateHeader>

      {/* 경매 목록 */}
      <AuctionWrapper>
        {displayList.map((item, index) => (
          <AuctionItem key={item.id}>
            <ImageContainer onClick={() => handleItemClick(item.id)}>
              <AuctionImage src={item.image} alt={item.title} />
              {/* '시작 안함' 상태일 때만 오버레이 표시 */}
              <StatusOverlay $show={item.status === "시작 안함"}>
                시작 안함
              </StatusOverlay>
            </ImageContainer>

            <InfoContainer>
              <AuctionNumber>{index + 1}경매</AuctionNumber>

              <InfoRow>
                <InfoText>
                  현재가 <span>{item.currentPrice.toLocaleString()} 원</span>
                </InfoText>
                <InfoText>남은 시간: {item.remainTime}</InfoText>
                <InfoText>입찰 횟수: {item.bidCount}회</InfoText>
                <InfoText>
                  입찰 단위: {item.bidUnit.toLocaleString()}원
                </InfoText>
                <InfoText>즉시 구매: {item.immediateBuy}</InfoText>
              </InfoRow>
            </InfoContainer>
          </AuctionItem>
        ))}
      </AuctionWrapper>
    </Container>
  );
};

export default MajorAuction;
