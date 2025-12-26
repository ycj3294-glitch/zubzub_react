import { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosAPI";

// --- 스타일 컴포넌트 ---

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

// 높이를 강제로 고정하여 내부 요소들이 무조건 이 높이를 따르게 함
const InputGroup = styled.div`
  display: flex;
  width: 100%;
  height: 42px; /* 전체 높이 고정 (테두리 포함) */
`;

const StyledInput = styled.input`
  flex: 1;
  height: 100%; /* 부모 높이 꽉 채움 */
  padding: 0 15px;

  /* [핵심] 테두리를 요소 크기 안쪽으로 포함시킴 */
  box-sizing: border-box;

  /* 스타일: 각지고 검은 테두리 */
  border: 1px solid #000;
  border-right: none; /* 버튼과 겹치는 오른쪽 선 제거 */
  border-radius: 10px 0 0 15px; /* 왼쪽만 둥글게 */

  font-size: 14px;
  font-weight: 500;
  color: #000;
  background: #fff;
  outline: none;

  /* 포커스 시: 테두리 두께가 안쪽으로만 굵어짐 (레이아웃 밀림 없음) */
  &:focus {
    background-color: #fafafa;
    box-shadow: inset 0 0 0 1px #000;
  }

  &::placeholder {
    color: #999;
    font-size: 13px;
  }

  /* 숫자 입력 스피너 제거 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const BidButton = styled.button`
  /* 가로 비율 설정 (예: 30%) */
  width: 30%;
  height: 100%; /* 부모 높이 꽉 채움 -> 인풋과 100% 동일해짐 */

  box-sizing: border-box; /* 테두리 포함 크기 계산 */

  /* 스타일 */
  border: 1px solid #000; /* 인풋과 동일한 1px 테두리 */
  border-radius: 0;
  background: #000;
  color: #fff; /* 흰색 글씨 (검정 배경엔 흰색이 가장 깔끔) */
  border-radius: 0 10px 10px 0;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #333;
  }

  &:active {
    background-color: #000;
  }
`;

const HelperText = styled.div`
  text-align: right;
  font-size: 12px;
  color: #666;

  span {
    color: #d4af37; /* 포인트 컬러 (골드) */
    font-weight: bold;
    margin-left: 4px;
  }
`;

// --- 컴포넌트 로직 ---

const CreateBidComponent = ({
  auctionId,
  finalPrice,
  minBidUnit,
  bidderId,
}) => {
  const [bidPrice, setBidPrice] = useState("");

  const currentPrice = Number(finalPrice) || 0;
  const unit = Number(minBidUnit) || 0;
  const minBidPrice = currentPrice + unit;

  const handleBid = async () => {
    if (!bidderId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const price = Number(bidPrice);

    if (!price || isNaN(price)) {
      alert("입찰 금액을 입력해주세요.");
      return;
    }

    if (price < minBidPrice) {
      alert(`최소 입찰 금액은 ${minBidPrice.toLocaleString()}원 입니다.`);
      return;
    }

    try {
      const confirmMsg = `${price.toLocaleString()}원으로 입찰하시겠습니까?\n(낙찰 시 취소 불가)`;
      if (!window.confirm(confirmMsg)) return;

      const response = await AxiosApi.createBid(auctionId, {
        bidderId: bidderId,
        price: price,
      });

      if (response) {
        alert("입찰 완료!");
        setBidPrice("");
      }
    } catch (error) {
      console.error(error);
      alert("입찰 중 오류가 발생했습니다.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBid();
  };

  return (
    <Wrapper>
      <InputGroup>
        <StyledInput
          type="number"
          placeholder={`${minBidPrice.toLocaleString()}원 이상`}
          value={bidPrice}
          onChange={(e) => setBidPrice(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <BidButton onClick={handleBid}>입찰하기</BidButton>
      </InputGroup>

      <HelperText>
        입찰 단위: <span>{unit.toLocaleString()} ZC</span>
      </HelperText>
    </Wrapper>
  );
};

export default CreateBidComponent;
