import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosAPI";
import { connectMessageBroadcast } from "../../api/broadcast";

// --- 스타일 컴포넌트 ---

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: "Courier New", Courier, monospace;

  /* 테두리 설정 */
  border: 1px solid #000;

  /* [핵심 변경] 위쪽은 직각(0), 아래쪽만 둥글게(15px) */
  /* 순서: 좌상단, 우상단, 우하단, 좌하단 */
  border-radius: 0 0 15px 15px;

  /* 둥근 모서리 밖으로 자식 요소가 튀어나가지 않게 자름 */
  overflow: hidden;
  box-sizing: border-box;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ChatMessage = styled.div`
  display: flex;
  justify-content: center;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const Sender = styled.span`
  font-weight: 900;
  margin-right: 8px;
  color: #000;
`;

const Content = styled.span`
  color: #333;
  word-break: break-all;
`;

const ChatInputRow = styled.div`
  display: flex;
  border-top: 1px solid #000;
  background: #fff;
  flex-shrink: 0;
  height: 45px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0 15px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 13px;
  background: transparent;
  color: #000;

  &::placeholder {
    color: #999;
  }
`;

const ChatButton = styled.button`
  padding: 0 20px;
  border: none;
  border-left: 1px solid #000;
  background: #fff;
  color: #000;
  font-weight: bold;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

// --- 컴포넌트 로직 ---

const ChatComponent = ({ chatId, nickname }) => {
  const [messages, setMessages] = useState([
    { sender: "SYSTEM", content: "Q&A Ready." },
  ]);
  const [input, setInput] = useState("");

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const loadMassages = async () => {
      try {
        const tmp = await AxiosApi.getChatMessages(chatId);
        if (tmp) setMessages(tmp);
      } catch (e) {
        console.error(e);
      }
    };
    loadMassages();

    connectMessageBroadcast(chatId, (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [chatId]);

  useEffect(() => {
    const el = chatMessagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { sender: nickname, content: input };
    setInput("");
    AxiosApi.sendChatMessage(chatId, newMessage);
  };

  return (
    <ChatContainer>
      <ChatMessages ref={chatMessagesRef}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx}>
            <Sender>{msg.sender}</Sender>
            <Content>{msg.content}</Content>
          </ChatMessage>
        ))}
      </ChatMessages>

      <ChatInputRow>
        <ChatInput
          type="text"
          value={input}
          placeholder="메시지 입력..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <ChatButton onClick={handleSend}>SEND</ChatButton>
      </ChatInputRow>
    </ChatContainer>
  );
};

export default ChatComponent;
