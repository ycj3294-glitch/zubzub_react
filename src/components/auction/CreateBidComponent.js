import { useState } from "react";
import AxiosApi, { createBid } from "../../api/AxiosAPI";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const BidInputWrapper = styled.div`
  display: flex;
  gap: 0; /* 간격 제거하여 하나로 붙임 */
  margin-bottom: 0;
  width: 100%;
`;

const BidInput = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 0;
  border: 1px solid #000;
  font-size: 16px;
  text-align: left; /* 텍스트 정렬 왼쪽으로 변경 */
  font-weight: bold;

  /* 가이드 이미지처럼 '입찰 금액 입력' 텍스트를 Input Placeholder 대신 사용 */
  background: #f7f7f7;
  color: #555;
  width: 70%;
  text-align: center;
  border-right: none;
`;

const BidButton = styled.button`
  padding: 12px 20px;
  border-radius: 0;
  border: 1px solid #000;
  background: #000;
  color: white;
  font-weight: bold;
  cursor: pointer;
  width: 30%; /* 비율 조정 */
  box-sizing: border-box;
`;

const CreateBidComponent = ({
  auctionId,
  finalPrice,
  minBidUnit,
  bidderId,
  style,
}) => {
  const [bidPrice, setBidPrice] = useState(0);

  const handleBid = () => {
    // 입찰 금액 유효성 검사 로직
    if (bidPrice < finalPrice + minBidUnit) {
      alert(
        `입찰 금액은 현재가 + 최소 입찰 단위인 ${
          finalPrice + minBidUnit
        }원보다 높아야 합니다.`
      );
      return;
    }
    AxiosApi.createBid(auctionId, { bidderId, price: bidPrice });
  };

  return (
    <BidInputWrapper style={style}>
      {/* 가이드 이미지의 '입찰 금액 입력' 텍스트를 표현하기 위해 임시 Input 사용 */}
      <BidInput
        as="div"
        style={{
          background: "none",
          border: "none",
          paddingLeft: "0",
          fontWeight: "bold",
          width: "auto",
          color: "#000",
        }}
      >
        입찰금액 입력
      </BidInput>
      <BidInput
        type="number"
        value={bidPrice}
        onChange={(e) => setBidPrice(Number(e.target.value))}
        placeholder={`최소 ${minBidUnit}원 단위`}
        min={finalPrice + minBidUnit}
        style={{
          flex: "none",
          width: "auto",
          border: "1px solid #000",
          borderRight: "none",
        }} // 실제 금액 입력 필드
      />
      <BidButton onClick={handleBid}>입찰</BidButton>
    </BidInputWrapper>
  );
};

export default CreateBidComponent;
