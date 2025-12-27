import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosAPI";

// --- 스타일 컴포넌트 ---

const Container = styled.div`
  /* 고정 크기 제거 -> 부모(BoardBody)에 꽉 차게 */
  width: 100%;
  height: 100%;

  overflow-y: auto;
  background-color: #fff;
  font-family: "Courier New", Courier, monospace; /* 채팅창과 동일 폰트 */
  padding: 0;

  /* 스크롤바 디자인 (채팅창과 통일) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Item = styled.div`
  display: grid;
  /* 그리드로 시간 | 닉네임 | 가격 정렬 깔끔하게 */
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px dashed #ddd; /* 점선 구분선 */
  font-size: 13px;
  color: #000;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

/* 각 컬럼별 스타일 */
const TimeCol = styled.div`
  color: #888;
  font-size: 12px;
  text-align: left;
`;

const UserCol = styled.div`
  font-weight: bold;
  text-align: center;
  /* 닉네임이 길면 말줄임표 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceCol = styled.div`
  font-weight: 900;
  text-align: right;
  color: #000;
`;

const Sentinel = styled.div`
  height: 1px;
  width: 100%;
  visibility: hidden;
`;

// --- 컴포넌트 로직 ---

const BidHistoryComponent = ({ auctionId }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const bottomRef = useRef(null);
  const topRef = useRef(null);

  // 데이터 로드 (무한 스크롤)
  const loadMore = async () => {
    try {
      const newItems = await AxiosApi.loadBidHistories(auctionId, page);
      if (newItems === null || newItems.length === 0) return;
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  // 새로고침 (상단 감지 시)
  const refresh = async () => {
    try {
      const newItems = await AxiosApi.loadBidHistories(auctionId, 0); // 0페이지 or 초기화
      if (newItems && newItems.length > 0) {
        setItems(newItems);
        setPage(1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const observerOption = { threshold: 0.1 };

    const bottomObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, observerOption);

    const topObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // 너무 잦은 호출 방지 로직이 필요할 수 있음
        refresh();
      }
    }, observerOption);

    if (bottomRef.current) bottomObserver.observe(bottomRef.current);
    if (topRef.current) topObserver.observe(topRef.current);

    return () => {
      if (bottomRef.current) bottomObserver.unobserve(bottomRef.current);
      if (topRef.current) topObserver.unobserve(topRef.current);
    };
  }, [page, auctionId]); // auctionId 의존성 추가

  // 날짜 포맷 헬퍼 (시간만 깔끔하게)
  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Container>
      {/* 위로 스크롤 시 최신 데이터 갱신용 */}
      <Sentinel ref={topRef} />

      {items && items.length > 0 ? (
        items.map((item, idx) => (
          <Item key={`${item.id}-${idx}`}>
            <TimeCol>{formatTime(item.bidTime)}</TimeCol>
            <UserCol>{item.bidderNickname || "익명"}</UserCol>
            <PriceCol>{(item.price || 0).toLocaleString()}</PriceCol>
          </Item>
        ))
      ) : (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#999",
            fontSize: "13px",
          }}
        >
          입찰 기록이 없습니다.
        </div>
      )}

      {/* 아래로 스크롤 시 과거 데이터 로드용 */}
      <Sentinel ref={bottomRef} />
    </Container>
  );
};

export default BidHistoryComponent;
