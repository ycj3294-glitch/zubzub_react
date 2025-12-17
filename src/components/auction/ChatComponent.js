import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { sendMessage, getMessages } from "../../api/chatApi";
import { connectMessageBroadcast } from "../../api/broadcast";

const ChatContainer = styled.div`
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
`;

const ChatHeader = styled.div`
  background: #4a90e2;
  color: white;
  padding: 10px;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
`;

const ChatMessages = styled.div`
  height: 300px; /* 고정 높이 */
  padding: 10px;
  overflow-y: auto; /* 내용이 넘치면 스크롤 */
  background: #f9f9f9;
`;

const ChatMessage = styled.div`
  height: 20px;
  display: flex;
  justify-content: left;
  align-items: center;
`;

const Sender = styled.span`
  height: 20px;
  display: flex;
  justify-content: left;
  align-items: center;
`;

const Content = styled.span``;

const ChatInput = styled.div`
  display: flex;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
`;

const Button = styled.button`
  padding: 8px 12px;
  background: #4a90e2;
  color: white;
  border: none;
  cursor: pointer;
`;

const ChatComponent = ({ chatId }) => {
  const [messages, setMessages] = useState([
    { sender: "System", content: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const loadMassages = async () => {
      const tmp = await getMessages(chatId);
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
    const newMessage = { sender: "Me", content: input };
    setInput("");
    sendMessage(chatId, newMessage);
  };

  return (
    <ChatContainer>
      <ChatHeader>💬 Chat Room</ChatHeader>
      <ChatMessages ref={chatMessagesRef}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} isMe={msg.sender === "Me"}>
            <Sender>{msg.sender}:</Sender>
            <Content>{msg.content}</Content>
          </ChatMessage>
        ))}
      </ChatMessages>
      <ChatInput>
        <Input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </ChatInput>
    </ChatContainer>
  );
};

export default ChatComponent;
