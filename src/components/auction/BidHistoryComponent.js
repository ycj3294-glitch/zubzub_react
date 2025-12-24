import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { loadBidHistories } from "../../api/AxiosAPI";

const Container = styled.div`
  width: 300px;
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  position: relative;
  background-color: #fafafa;

  /* 스크롤바 커스터마이징 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
  gap: 10px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

const Value = styled.span`
  color: #222;
`;

const Price = styled.span`
  font-weight: bold;
  color: #0077cc;
`;

const Time = styled.span`
  font-size: 12px;
  color: #888;
`;

const Sentinel = styled.div`
  height: 1px;
`;

const BidHistoryComponent = ({ auctionId }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const bottomRef = useRef(null);
  const topRef = useRef(null);

  // 데이터 로드
  const loadMore = async () => {
    const newItems = await loadBidHistories(auctionId, page);
    if (newItems === null || newItems.length === 0) return;
    setItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
  };

  // 새로고침
  const refresh = async () => {
    setItems([]);
    const newItems = await loadBidHistories(auctionId, 0);
    if (newItems === null || newItems.length === 0) return;
    setItems(newItems);
    setPage(1);
  };

  useEffect(() => {
    const bottomObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    const topObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          refresh();
        }
      },
      { threshold: 1 }
    );

    if (bottomRef.current) bottomObserver.observe(bottomRef.current);
    if (topRef.current) topObserver.observe(topRef.current);

    return () => {
      if (bottomRef.current) bottomObserver.unobserve(bottomRef.current);
      if (topRef.current) topObserver.unobserve(topRef.current);
    };
  }, [page]);

  return (
    <Container>
      {/* 맨 위 감지용 */}
      <Sentinel ref={topRef} />
      {items &&
        items.map((item, idx) => (
          <Item key={idx}>
            <InfoGroup>
              <Label>ID</Label>
              <Value>{item.id}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label>회원</Label>
              <Value>{item.memberId}</Value>
            </InfoGroup>
            <InfoGroup>
              <Label>가격</Label>
              <Price>{item.price} 원</Price>
            </InfoGroup>
            <InfoGroup>
              <Label>시간</Label>
              <Time>{item.bidTime}</Time>
            </InfoGroup>
          </Item>
        ))}
      {/* 맨 아래 감지용 */}
      <Sentinel ref={bottomRef} />
    </Container>
  );
};

export default BidHistoryComponent;
