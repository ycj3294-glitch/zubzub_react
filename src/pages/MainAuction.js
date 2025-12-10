import { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const MainAuction = () => {
  useEffect(() => {
    const socket = new SockJS("http://localhost:8111/ws"); // 서버 엔드포인트
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 자동 재연결
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/auction.1", (msg) => {
        console.log("경매 업데이트:", JSON.parse(msg.body));
      });

      // 메시지 보내기 예시
      stompClient.publish({
        destination: "/app/bid",
        body: JSON.stringify({ auctionId: 1, bidderId: 42, bidAmount: 2000 }),
      });
    };

    stompClient.activate();
  }, []);

  return (
    <>
      <div>메인경매페이지</div>
      <div></div>
    </>
  );
};

export default MainAuction;
