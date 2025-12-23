// MajorAuction.js (대규모 경매 목록 페이지)

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosApi from "../api/AxiosAPI";

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
const DATE_DATA = Array.from({ length: 7 }, (_, i) => {
  const date = getAuctionDate(i); // 오늘 + i일
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 2자리
  const day = String(date.getDate()).padStart(2, "0"); // 2자리
  return {
    day: date.getDate(),
    date: `${date.getMonth() + 1}.${date.getDate()}`,
    name: `${date.getDate()}일`, // ← 자동 생성
    iso: `${year}-${month}-${day}`,
  };
});

// 남은 시간 계산 함수
const getRemainingTime = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now; // 밀리초 단위 차이

  if (diff <= 0) return "00:00:00"; // 이미 종료된 경우

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

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
   Component
========================= */

const MajorAuction = () => {
  const nav = useNavigate();
  const [activeDate, setActiveDate] = useState(DATE_DATA[0].iso); //
  const [displayList, setDisplayList] = useState([]);

  // 현재 활성화된 날짜에 따라 경매 목록을 필터링하는 로직 (더미이므로 모든 날짜에 동일 목록 표시)
  // const displayList = AUCTION_LIST;

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await AxiosApi.get(
          "/api/auctions/majorlist/by-date", // axios url
          { params: { date: activeDate } } // ← 옵션 객체 끝
        ); // ← axios.get 끝나는 괄호
        setDisplayList(response.data); // ← try 블록 안에서 호출
      } catch (error) {
        console.error("경매 데이터를 불러오는 중 오류 발생", error);
      }
    };

    fetchAuctions();
  }, [activeDate]);

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
            $active={item.iso === activeDate}
            onClick={() => {
              console.log("Selected date:", item.iso);
              setActiveDate(item.iso);
            }}
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
              <AuctionImage src={item.itemImg} alt={item.itemName} />
              {/* '시작 안함' 상태일 때만 오버레이 표시 */}
              <StatusOverlay $show={item.auctionStatus === "시작 안함"}>
                시작 안함
              </StatusOverlay>
            </ImageContainer>

            <InfoContainer>
              <AuctionNumber>{index + 1}경매</AuctionNumber>

              <InfoRow>
                <InfoText>
                  현재가 <span>{item.startPrice.toLocaleString()} 원</span>
                </InfoText>
                <InfoText>남은 시간: {getRemainingTime(item.endTime)}</InfoText>
                <InfoText>입찰 횟수: 회</InfoText>
                <InfoText>입찰 단위: 원</InfoText>
              </InfoRow>
            </InfoContainer>
          </AuctionItem>
        ))}
      </AuctionWrapper>
    </Container>
  );
};

export default MajorAuction;
