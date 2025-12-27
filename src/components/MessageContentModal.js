import styled from "styled-components";

/* ===================== styled ===================== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 1001;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  background: white;
  border-radius: 20px;
  border: 1px solid #ccc;
  padding: 24px;
  z-index: 1001;
  display: flex;
  flex-direction: column;

  /* 📌 모바일 대응 */
  @media (max-width: 768px) {
    width: 85%; /* 화면의 85% 정도로 줄임 */
    height: auto; /* 높이는 내용에 맞게 */
    max-height: 60%; /* 너무 길어지지 않게 제한 */
    padding: 16px; /* 패딩 줄이기 */
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    width: 90%; /* 더 작은 화면에서는 거의 꽉 차게 */
    max-height: 55%; /* 아까 만든 모달보다 조금 더 작게 */
    padding: 12px;
    border-radius: 8px;
  }
`;

const CloseX = styled.div`
  position: absolute;
  top: 20px;
  right: 24px;
  cursor: pointer;
  font-size: 28px;
  font-weight: 300;
  color: #333;
  line-height: 1;
`;

/* 타이틀과 콘텐츠 스타일 추가 */
const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #222;
`;

const Content = styled.div`
  flex: 1;
  font-size: 16px;
  line-height: 1.5;
  color: #555;
  overflow-y: auto; /* 내용이 많으면 스크롤 */
`;

/* ===================== Component ===================== */
const MessageContentModal = ({ onClose, title, content }) => {
  return (
    <>
      <Overlay onClick={onClose} />

      <Modal>
        <CloseX onClick={onClose}>&times;</CloseX>

        <Title>{title}</Title>
        <Content>{content}</Content>
      </Modal>
    </>
  );
};

export default MessageContentModal;
