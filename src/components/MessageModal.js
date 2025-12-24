import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { getReceivedMessages, readMessage } from "../api/AxiosAPI";

/* ===================== styled (생략 - 기존과 동일) ===================== */
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
`;
const Title = styled.h2`
  margin-bottom: 16px;
`;
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 4fr 1.5fr;
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 4fr 1.5fr;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
`;
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

/* ===================== Component ===================== */
const MessageModal = ({ onClose }) => {
  // 초기값을 빈 배열로 설정하여 .map 에러 방지
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleReceive = async () => {
    try {
      setLoading(true);
      const data = await getReceivedMessages();
      console.log("서버 응답:", data); // 데이터 구조 확인용

      // Page 객체의 content 배열을 안전하게 가져옴
      if (data && data.content) {
        setMessages(data.content);
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.error("쪽지 목록 로딩 실패:", e);
      setMessages([]); // 에러 시 빈 배열로 초기화하여 렌더링 에러 방지
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id, currentIsRead) => {
    // 백엔드 필드명 isRead 기준 체크
    if (!currentIsRead) {
      try {
        await readMessage(id);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
        );
      } catch (e) {
        console.error("읽음 처리 실패:", e);
      }
    }
  };

  useEffect(() => {
    handleReceive();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "40px" }}>로딩 중...</p>
        ) : // messages 존재 여부와 길이를 동시에 체크하여 안전하게 map 실행
        messages && messages.length > 0 ? (
          messages.map((msg) => (
            <Row key={msg.id} onClick={() => handleRead(msg.id, msg.isRead)}>
              <span>운영자</span>
              <Content unread={!msg.isRead}>
                {!msg.isRead && <NewAlert>[!] </NewAlert>}
                {msg.title || msg.content}
              </Content>
              <span>{formatDate(msg.createdAt)}</span>
            </Row>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "40px", color: "#888" }}>
            받은 쪽지가 없습니다.
          </p>
        )}

        <Pagination>
          <button>≪</button> <button>‹</button>
          <strong>1</strong>
          <button>›</button> <button>≫</button>
        </Pagination>
      </Modal>
    </>
  );
};

export default MessageModal;
