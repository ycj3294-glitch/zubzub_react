import { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosAPI";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  width: 360px;
  background: white;
  border-radius: 16px;
  padding: 24px;
`;

const AmountBtn = styled.button`
  width: 100%;
  margin: 6px 0;
`;

const ChargeModal = ({ onClose, userId, onSuccess }) => {
  const [amount, setAmount] = useState("");

  const handleCharge = async () => {
    const numericAmount = parseInt(amount);
    console.log(userId, numericAmount);
    if (!numericAmount || numericAmount <= 0) {
      alert("올바른 금액을 입력해주세요.");
      return;
    }

    console.log(`${numericAmount}원 충전요청`);
    try {
      const success = await AxiosApi.chargeCredit(userId, numericAmount);
      if (success) {
        alert(`${numericAmount.toLocaleString()}원 충전 완료!`);
        onSuccess?.(numericAmount);
        onClose();
      }
    } catch (error) {
      alert("충전 중 오류가 발생했습니다.");
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <h3>코인 충전</h3>
        <input
          type="number"
          placeholder="충전할 금액 입력"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />
        <button onClick={handleCharge}>충전하기</button>
      </Modal>
    </Overlay>
  );
};

export default ChargeModal;
