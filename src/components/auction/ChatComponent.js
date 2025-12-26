import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosAPI";
import { connectMessageBroadcast } from "../../api/broadcast";

const ChatContainer = styled.div`
  width: 320px;
  border: 1px solid #000; /* 얇은 검은색 실선 */
  border-radius: 0; /* 각지게 */
  display: flex;
  flex-direction: column;
  font-family: monospace; /* 터미널 느낌 */
  background: #fff;
`;

const ChatHeader = styled.div`
  background: #000; /* 헤더 블랙 */
  color: #fff;
  padding: 8px; /* 조금 더 얇게 */
  font-weight: bold;
  border-radius: 0;
  text-align: left;
`;

const ChatMessages = styled.div`
  height: 300px;
  padding: 8px;
  overflow-y: auto;
  background: #fdfdfd;
  border-top: 1px solid #000;
`;

const ChatMessage = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px dotted #000; /* dashed → dotted로 더 가볍게 */
  padding-bottom: 4px;
`;

const Sender = styled.span`
  font-weight: bold;
  margin-right: 6px;
  color: #000;
`;

const Content = styled.span`
  color: #333;
`;

const ChatInputRow = styled.div`
  display: flex;
  gap: 0;
  border-top: 1px solid #000; /* 위쪽만 선 */
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  font-size: 14px;
`;

const ChatButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: #000;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const ChatComponent = ({ chatId, nickname }) => {
  const [messages, setMessages] = useState([
    { sender: "System", content: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const loadMassages = async () => {
      const tmp = await AxiosApi.getChatMessages(chatId);
      setMessages(tmp);
    };
    loadMassages();

    connectMessageBroadcast(chatId, (message) => {
      setMessages((prev) => [...prev, message]);
      console.log("채팅 업데이트:", message);
    });
  }, [chatId]);

  useEffect(() => {
    const el = chatMessagesRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { sender: nickname, content: input };
    setInput("");
    AxiosApi.sendChatMessage(chatId, newMessage);
  };

  return (
    <>
      <ChatContainer>
        <ChatHeader>채팅창</ChatHeader>
        <ChatMessages ref={chatMessagesRef}>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx}>
              <Sender>{msg.sender}:</Sender>
              <Content>{msg.content}</Content>
            </ChatMessage>
          ))}
        </ChatMessages>
        <ChatInputRow>
          <ChatInput
            type="text"
            value={input}
            placeholder="채팅을 입력하세요"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <ChatButton onClick={handleSend}>입력</ChatButton>
        </ChatInputRow>
      </ChatContainer>
    </>
  );
};

export default ChatComponent;
