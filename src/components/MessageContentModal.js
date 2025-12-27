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
