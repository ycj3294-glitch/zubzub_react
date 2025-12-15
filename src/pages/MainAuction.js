import { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router-dom";

const MainAuction = () => {
  const { id } = useParams();

  const [auction, setAuction] = useState({});

  const [remaining, setRemaining] = useState(0);

  const [auctionFormData, setAuctionFormData] = useState({
    auctionType: "",
    category: "",
    sellerId: "",
    itemName: "",
    itemDesc: "",
    startPrice: "",
    startTime: "",
    endTime: "",
  });

  const [bidFormData, setBidFormData] = useState({
    memberId: "",
    price: "",
  });

  useEffect(() => {
    const now = new Date();
    const startTime = new Date(auction.startTime); // 문자열 → Date 객체 변환
    const endTime = new Date(auction.endTime);
    const extendedEndTime = auction.extendedEndTime
      ? new Date(auction.extendedEndTime)
      : null;

    let end;
    if (startTime > now) {
      // 아직 시작 전이면 시작시간 표시
      end = startTime;
    } else {
      // 시작 이후라면 연장종료시간 있으면 그것을, 없으면 종료시간 표시
      end = extendedEndTime || endTime;
    }

    if (!end) return;

    const updateRemaining = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000)); // 초 단위
      setRemaining(diff);
    };

    // 최초 계산
    updateRemaining();

    // 1초마다 갱신
    const timer = setInterval(updateRemaining, 1000);

    return () => clearInterval(timer); // endTime 바뀔 때마다 기존 타이머 정리
  }, [auction]);

  // 시/분/초로 변환
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const reseiveAuction = async () => {
    const res = await axios.get("http://localhost:8111/auctions/" + id);
    console.log(res);
    setAuction(res.data);
  };

  const sendAuction = async () => {
    console.log(auctionFormData);

    const res = await axios.post(
      "http://localhost:8111/auctions",
      auctionFormData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(res);
  };

  const sendBid = async () => {
    const res = await axios.post(
      "http://localhost:8111/auctions/" + id + "/bids",
      bidFormData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(res);
  };

  useEffect(() => {
    const reseiveBroadcast = () => {
      const socket = new SockJS("http://localhost:8111/ws"); // 서버 엔드포인트
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // 자동 재연결
      });

      stompClient.onConnect = () => {
        stompClient.subscribe("/topic/auction." + id, (msg) => {
          setAuction((prev) => ({ ...prev, ...JSON.parse(msg.body) }));
          console.log("경매 업데이트:", JSON.parse(msg.body));
        });

        // 메시지 보내기 예시
        stompClient.publish({
          destination: "/app/bid",
          body: JSON.stringify({ auctionId: 1, bidderId: 42, bidAmount: 2000 }),
        });
      };
      stompClient.activate();
    };

    reseiveAuction();
    reseiveBroadcast();
  }, []);

  const handleAuctionFormChange = (e) => {
    const { name, value } = e.target;
    setAuctionFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBidFormChange = (e) => {
    const { name, value } = e.target;
    setBidFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 필드 정의 배열
  const auctionFields = [
    { label: "경매 유형", name: "auctionType", type: "text" },
    { label: "카테고리", name: "category", type: "text" },
    { label: "판매자 ID", name: "sellerId", type: "number" },
    { label: "상품명", name: "itemName", type: "text" },
    { label: "상품 설명", name: "itemDesc", type: "textarea" },
    { label: "시작가", name: "startPrice", type: "number" },
    { label: "시작 시간", name: "startTime", type: "datetime-local" },
    { label: "종료 시간", name: "endTime", type: "datetime-local" },
  ];

  const bidFields = [
    { label: "입찰자 ID", name: "memberId", type: "text" },
    { label: "입찰가", name: "price", type: "text" },
  ];

  return (
    <>
      <div>
        <div>메인경매페이지</div>
        <div>id : {auction.id}</div>
        <div>auctionType : {auction.auctionType}</div>
        <div>category : {auction.category}</div>
        <div>sellerId : {auction.sellerId}</div>
        <div>itemName : {auction.itemName}</div>
        <div>itemDesc : {auction.itemDesc}</div>
        <div>startPrice : {auction.startPrice}</div>
        <div>finalPrice : {auction.finalPrice}</div>
        <div>itemImg : {auction.itemImg}</div>
        <div>itemStatus : {auction.itemStatus}</div>
        <div>startTime : {auction.startTime}</div>
        <div>endTime : {auction.endTime}</div>
        <div>extendedEndTime : {auction.extendedEndTime}</div>
        <div>winnerId : {auction.winnerId}</div>
        <div></div>
      </div>

      <div>
        <h3>남은 시간</h3>
        <p>
          {hours}시간 {minutes}분 {seconds}초
        </p>
      </div>

      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendAuction();
          }}
        >
          {auctionFields.map((field) => (
            <div key={field.name} style={{ marginBottom: "15px" }}>
              <label>
                {field.label}:{" "}
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={auctionFormData[field.name]}
                    onChange={handleAuctionFormChange}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={auctionFormData[field.name]}
                    onChange={handleAuctionFormChange}
                  />
                )}
              </label>
            </div>
          ))}
          <button type="submit">등록하기</button>
        </form>
      </div>

      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendBid();
          }}
        >
          {bidFields.map((field) => (
            <div key={field.name} style={{ marginBottom: "15px" }}>
              <label>
                {field.label}:{" "}
                {
                  <input
                    type={field.type}
                    name={field.name}
                    value={bidFormData[field.name]}
                    onChange={handleBidFormChange}
                  />
                }
              </label>
            </div>
          ))}
          <button type="submit">입찰</button>
        </form>
      </div>
    </>
  );
};

export default MainAuction;
