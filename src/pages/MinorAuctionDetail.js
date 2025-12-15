import { useParams } from "react-router-dom";

const MinorAuctionDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>소규모 경매 상세</h1>
      <p>경매 ID: {id}</p>
    </div>
  );
};

export default MinorAuctionDetail;
