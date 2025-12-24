// AuctionInfoComponent.tsx
import { useEffect, useState } from "react";
import { getAuction } from "../../api/AxiosAPI";
import { connectBidBroadcast } from "../../api/broadcast";
import TimerComponent from "./TimerComponent";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  row-gap: 0.75rem;
  column-gap: 1rem;
  font-size: 0.95rem;
`;

const Label = styled.div`
  font-weight: 600;
  color: #374151;
`;

const Value = styled.div`
  color: #4b5563;
  word-break: break-word;
`;

const AuctionInfoComponent = ({ auctionId }) => {
  const [auction, setAuction] = useState({});
  const [end, setEnd] = useState("");

  useEffect(() => {
    const loadAuction = async () => {
      const tmp = await getAuction(auctionId);
      setAuction(tmp);
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
      <Title>메인 경매 페이지</Title>
      {
        <InfoGrid>
          <Label>ID</Label>
          <Value>{auction && auction.id}</Value>
          <Label>경매 유형</Label>
          <Value>{auction && auction.auctionType}</Value>
          <Label>카테고리</Label>
          <Value>{auction && auction.category}</Value>
          <Label>판매자 ID</Label>
          <Value>{auction && auction.sellerId}</Value>
          <Label>상품명</Label>
          <Value>{auction && auction.itemName}</Value>
          <Label>상품 설명</Label>
          <Value>{auction && auction.itemDesc}</Value>
          <Label>시작가</Label>
          <Value>{auction && auction.startPrice}</Value>
          <Label>최종가</Label>
          <Value>{auction && auction.finalPrice}</Value>
          <Label>상품 이미지</Label>
          <Value>
            {auction && (
              <img
                src={auction.itemImg}
                alt="상품 이미지"
                style={{ width: "100px", height: "100px" }}
              ></img>
            )}
          </Value>
          <Label>경매 상태</Label>
          <Value>{auction && auction.auctionStatus}</Value>
          <Label>시작 시간</Label>
          <Value>{auction && auction.startTime}</Value>
          <Label>종료 시간</Label>
          <Value>{auction && auction.endTime}</Value>
          <Label>연장 종료</Label>
          <Value>{auction && auction.extendedEndTime}</Value>
          <Label>낙찰자 ID</Label>
          <Value>{auction && auction.winnerId}</Value>
        </InfoGrid>
      }
      <div style={{ marginTop: "1.5rem" }}>
        <TimerComponent end={end} />
      </div>
    </Container>
  );
};

export default AuctionInfoComponent;
