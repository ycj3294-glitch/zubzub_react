import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://192.168.0.93:8111/ws";

// 경매 연결
export const connectBidBroadcast = (auctionId, onMessage) => {
  try {
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("Connected to auction broadcast:", auctionId);
      stompClient.subscribe(`/topic/auction.${auctionId}`, (msg) => {
        try {
          const data = JSON.parse(msg.body);
          onMessage(data);
        } catch (err) {
          console.error("Message parse error:", err);
        }
      });
    };

    // 에러 핸들링
    stompClient.onStompError = (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    };

    stompClient.onWebSocketError = (err) => {
      console.error("WebSocket error:", err);
    };

    stompClient.onDisconnect = () => {
      console.warn("Disconnected from auction broadcast");
    };

    stompClient.activate();
    return stompClient;
  } catch (err) {
    console.error("connectBidBroadcast error:", err);
    return null;
  }
};

// 채팅 연결
export const connectMessageBroadcast = (chatId, onMessage) => {
  try {
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("Connected to chat broadcast:", chatId);
      stompClient.subscribe(`/topic/chat.${chatId}`, (msg) => {
        try {
          const data = JSON.parse(msg.body);
          onMessage(data);
        } catch (err) {
          console.error("Message parse error:", err);
        }
      });
    };

    // 에러 핸들링
    stompClient.onStompError = (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    };

    stompClient.onWebSocketError = (err) => {
      console.error("WebSocket error:", err);
    };

    stompClient.onDisconnect = () => {
      console.warn("Disconnected from chat broadcast");
    };

    stompClient.activate();
    return stompClient;
  } catch (err) {
    console.error("connectMessageBroadcast error:", err);
    return null;
  }
};
