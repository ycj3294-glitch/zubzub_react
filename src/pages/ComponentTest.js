// Grid.tsx
import styled from "styled-components";
import AuctionInfoComponent from "../components/auction/AuctionInfoComponent";
import CreateAuction from "../components/auction/CreateAuctionComponent";
import CreateBidComponent from "../components/auction/CreateBidComponent";
import BidHistoryComponent from "../components/auction/BidHistoryComponent";
import ChatComponent from "../components/ChatComponent";
import ImageUploader from "../components/ImageUploader";

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* 아이템 간격 */
  width: 800px; /* 전체 그리드 크기 */
`;

export const Cell = styled.div`
  width: 100%;
  flex: 0 0 calc(50% - 6px); /* 2개씩 배치 */
  aspect-ratio: 1 / 1; /* 정사각형 유지 */
  background: #f3f4f6;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #374151;
`;

const ComponentTest = () => {
  return (
    <>
      <Grid>
        <Cell>
          <AuctionInfoComponent auctionId={1}></AuctionInfoComponent>
        </Cell>
        <Cell>
          <ChatComponent chatId={1}></ChatComponent>
        </Cell>
        <Cell>
          <CreateAuction></CreateAuction>
        </Cell>
        <Cell>
          <CreateBidComponent auctionId={1}></CreateBidComponent>
        </Cell>
        <Cell>
          <BidHistoryComponent auctionId={1}></BidHistoryComponent>
        </Cell>
      </Grid>
    </>
  );
};

export default ComponentTest;
