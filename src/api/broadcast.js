import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://192.168.0.93:8111/ws";

export const connectBidBroadcast = (auctionId, onMessage) => {
  const socket = new SockJS(SOCKET_URL);
  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    stompClient.subscribe(`/topic/auction.${auctionId}`, (msg) => {
      const data = JSON.parse(msg.body);
      onMessage(data);
    });
  };

  stompClient.activate();
};

export const connectMessageBroadcast = (chatId, onMessage) => {
  const socket = new SockJS(SOCKET_URL);
  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    stompClient.subscribe(`/topic/chat.${chatId}`, (msg) => {
      const data = JSON.parse(msg.body);
      onMessage(data);
    });
  };

  stompClient.activate();
};
