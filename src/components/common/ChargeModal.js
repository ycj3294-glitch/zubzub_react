import styled from "styled-components";

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

const ChargeModal = ({ onClose }) => {
  const amounts = [10000, 30000, 50000];

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <h3>코인 충전</h3>
        {amounts.map((a) => (
          <AmountBtn key={a} onClick={() => alert(`${a}원 충전됨 (더미)`)}>
            {a.toLocaleString()}원
          </AmountBtn>
        ))}
      </Modal>
    </Overlay>
  );
};

export default ChargeModal;
