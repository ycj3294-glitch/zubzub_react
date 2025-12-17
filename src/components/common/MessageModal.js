import styled from "styled-components";

/* =====================
   Dummy Data
===================== */

const MESSAGES = [
  {
    id: 1,
    sender: "운영자",
    content: "줍줍 회원님! 상위 입찰자가 갱신되었습니다.",
    time: "25.12.16 - 15:47:34",
    read: false,
  },
];

/* =====================
   styled
===================== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 80px;
  right: 40px;
  width: 760px;
  height: 520px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 16px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1.5fr;
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1.5fr;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const Content = styled.span`
  color: ${(props) => (props.unread ? "#000" : "#888")};
  font-weight: ${(props) => (props.unread ? "bold" : "normal")};
`;

const Pagination = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

/* =====================
   Component
===================== */

const MessageModal = ({ onClose }) => {
  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <Title>쪽지함</Title>

        <TableHeader>
          <span>보낸 사람</span>
          <span>내용</span>
          <span>받은 시간</span>
        </TableHeader>

        {MESSAGES.map((msg) => (
          <Row key={msg.id}>
            <span>{msg.sender}</span>
            <Content unread={!msg.read}>{msg.content}</Content>
            <span>{msg.time}</span>
          </Row>
        ))}

        <Pagination>
          <button>≪</button>
          <button>‹</button>
          <strong>1</strong>
          <button>2</button>
          <button>3</button>
          <button>›</button>
          <button>≫</button>
        </Pagination>
      </Modal>
    </>
  );
};

export default MessageModal;
