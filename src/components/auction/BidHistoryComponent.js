import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { loadBidHistories } from "../../api/AxiosAPI";

const Container = styled.div`
  width: 320px;
  height: 300px;
  overflow-y: auto;
  border: 1px solid #000; /* 얇은 검은색 실선 */
  border-radius: 0; /* 각지게 */
  padding: 10px;
  position: relative;
  background-color: #fff;
  font-family: monospace; /* 터미널 느낌 */

  /* 스크롤바 커스터마이징 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #000;
  }
  &::-webkit-scrollbar-track {
    background-color: #fdfdfd;
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px;
  border-bottom: 1px dotted #000; /* 메시지 구분선 */
  font-size: 13px;
  color: #000;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #000;
`;

const Value = styled.span`
  color: #333;
`;

const Price = styled.span`
  font-weight: bold;
  color: #000; /* 블랙 강조 */
`;

const Time = styled.span`
  font-size: 12px;
  color: #555;
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
              <Value>{item.bidderNickname}</Value>
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
