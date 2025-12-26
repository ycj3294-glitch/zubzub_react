// MajorAuction.js (프리미엄 경매 목록 페이지)

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
   날짜 로직 (오늘 기준 앞뒤 3일 총 7일 자동 생성)
========================= */

const DATE_DATA = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  // i가 0~6이므로, i - 3을 하면 오늘 기준으로 -3, -2, -1, 0, 1, 2, 3일이 됨
  date.setDate(date.getDate() + (i - 3));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return {
    day: date.getDate(),
    date: `${date.getMonth() + 1}.${date.getDate()}`,
    name: `${date.getDate()}일`,
    iso: `${year}-${month}-${day}`,
  };
});

// 남은 시간 계산 함수
const getRemainingTime = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) return "00:00:00";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

/* =========================
   Component
========================= */

const MajorAuction = () => {
  const nav = useNavigate();
  // ✅ DATE_DATA[3]이 항상 '오늘'이므로 초기값을 오늘 날짜로 설정
  const [activeDate, setActiveDate] = useState(DATE_DATA[3].iso);
  const [displayList, setDisplayList] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await AxiosApi.get("/api/auctions/majorlist/by-date", {
          params: { date: activeDate },
        });
        setDisplayList(response.data);
      } catch (error) {
        console.error("경매 데이터를 불러오는 중 오류 발생", error);
      }
    };

    fetchAuctions();
  }, [activeDate]);

  const handleItemClick = (id) => {
    nav(`/auction/major/${id}`);
  };

  return (
    <Container>
      <PageHeader>프리미엄 경매</PageHeader>

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
              <StatusOverlay $show={item.auctionStatus === "시작 안함"}>
                시작 안함
              </StatusOverlay>
            </ImageContainer>

            <InfoContainer>
              <AuctionNumber>{index + 1}경매</AuctionNumber>

              <InfoRow>
                <InfoText>
                  현재가 <span>{item.startPrice?.toLocaleString()} 원</span>
                </InfoText>
                <InfoText>남은 시간: {getRemainingTime(item.endTime)}</InfoText>
                <InfoText>입찰 횟수: {item.bidCount || 0}회</InfoText>
                <InfoText>
                  입찰 단위: {item.bidUnit?.toLocaleString() || 0}원
                </InfoText>
              </InfoRow>
            </InfoContainer>
          </AuctionItem>
        ))}
      </AuctionWrapper>
    </Container>
  );
};

export default MajorAuction;
