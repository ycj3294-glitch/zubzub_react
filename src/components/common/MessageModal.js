import styled from "styled-components";
import React, { useState } from "react"; // ✅ useState 추가

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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 760px;
  height: 520px;
  background: white;
  border-radius: 20px;
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
  z-index: 1002;
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
  cursor: pointer; /* 클릭 가능함을 표시 */
  &:hover {
    background: #f9f9f9;
  }
`;

/* ✅ 빨간색 느낌표 알림 스타일 */
const NewAlert = styled.span`
  color: #ff4d4f;
  font-weight: bold;
  margin-right: 4px;
`;

const Content = styled.span`
  color: ${(props) => (props.unread ? "#000" : "#888")};
  font-weight: ${(props) => (props.unread ? "bold" : "normal")};
  display: flex;
  align-items: center;
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
  // ✅ 메세지 상태 관리 (초기값은 Dummy Data)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "운영자",
      content: "줍줍 회원님! 상위 입찰자가 갱신되었습니다.",
      time: "25.12.16 - 15:47:34",
      read: false, // 처음엔 읽지 않음 상태
    },
    {
      id: 2,
      sender: "시스템",
      content: "회원가입을 축하드립니다!",
      time: "25.12.15 - 10:20:11",
      read: true,
    },
  ]);

  // ✅ 메세지 클릭 시 읽음 처리하는 함수
  const handleRead = (id) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <CloseX onClick={onClose}>&times;</CloseX>
        <Title>쪽지함</Title>

        <TableHeader>
          <span>보낸 사람</span>
          <span>내용</span>
          <span>받은 시간</span>
        </TableHeader>

        {messages.map((msg) => (
          <Row key={msg.id} onClick={() => handleRead(msg.id)}>
            <span>{msg.sender}</span>
            <Content unread={!msg.read}>
              {/* ✅ 읽지 않은 메세지일 때만 빨간 느낌표 표시 */}
              {!msg.read && <NewAlert>[!] </NewAlert>}
              {msg.content}
            </Content>
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
