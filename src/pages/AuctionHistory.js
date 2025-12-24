import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../api/AxiosAPI";
import { jwtDecode } from "jwt-decode";

/* =====================
   Styled Components
===================== */

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 40px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  position: relative;
`;

const CloseBtn = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  font-size: 28px;
  line-height: 1;
`;

const Title = styled.h2`
  margin-bottom: 30px;
  text-align: center;
  font-weight: 800;
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 10px 25px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#000" : "#888")};
  border-bottom: ${(props) => (props.active ? "3px solid #000" : "none")};
  cursor: pointer;
  margin-bottom: -2px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  padding: 12px 10px;
  background: #f8f9fa;
  font-weight: bold;
  border-radius: 8px;
  text-align: center;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  padding: 16px 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #fcfcfc;
  }
`;

/* 페이지네이션 스타일 */
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;

  button {
    padding: 5px 10px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    border-radius: 4px;
    &:disabled {
      color: #ccc;
      cursor: default;
    }
    &.active {
      background: #000;
      color: #fff;
      border-color: #000;
    }
  }
`;

/* 상세 모달 스타일 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  width: 400px;
  position: relative;
`;

/* =====================
   Component
===================== */

const AuctionHistory = () => {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("purchase");
  const [memberId, setMemberId] = useState(null);
  // 구매내역 관련 데이터
  const [purchaseData, setPurchaseData] = useState([]); // 구매 내역 데이터
  const [purchasePage, setPurchasePage] = useState(1);
  const [purchaseTotalPages, setPurchaseTotalPages] = useState(1);
  // 판매내역 관련 데이터
  const [salesData, setSalesData] = useState([]); // 판매 내역 데이터
  const [salesPage, setSalesPage] = useState(1);
  const [salesTotalPages, setSalesTotalPages] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null); // 모달 상세 정보

  // JWT에서 userId 추출
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded); // payload 확인
        setMemberId(decoded.memberId); // 실제 이름 확인 후 수정
      } catch (err) {
        console.error("토큰 디코딩 실패", err);
      }
    }
  }, []);

  // 구매 내역 가져오기
  useEffect(() => {
    if (!memberId) return; // memberId가 없으면 요청하지 않음
    const fetchPurchaseListInfo = async () => {
      try {
        // 구매 내역
        const purchaseResponse = await AxiosApi.getWinList(memberId);
        setPurchaseData(purchaseResponse.data.content);
        setPurchaseTotalPages(purchaseResponse.data.totalPages);
        setPurchasePage(purchaseResponse.data.number);
      } catch (err) {
        console.error("데이터를 가져오는데 실패했습니다.", err);
      }
    };

    fetchPurchaseListInfo();
  }, [memberId, purchasePage]);

  // 판매 내역 가져오기
  useEffect(() => {
    if (!memberId) return; // memberId가 없으면 요청하지 않음
    const fetchSellListInfo = async () => {
      try {
        // 판매 내역
        const salesResponse = await AxiosApi.getSellList(memberId);
        setSalesData(salesResponse.data.content);
        setSalesTotalPages(salesResponse.data.totalPages);
        setSalesPage(salesResponse.data.number);
      } catch (err) {
        console.error("데이터를 가져오는데 실패했습니다.", err);
      }
    };

    fetchSellListInfo();
  }, [memberId, salesPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPurchasePage(1); // 탭 변경 시 1페이지로 리셋
  };

  return (
    <Container>
      <CloseBtn onClick={() => nav("/mypage")}>&times;</CloseBtn>
      <Title>경매 내역 상세</Title>

      <TabWrapper>
        <TabButton
          active={activeTab === "purchase"}
          onClick={() => handleTabChange("purchase")}
        >
          구매 내역
        </TabButton>
        <TabButton
          active={activeTab === "sales"}
          onClick={() => handleTabChange("sales")}
        >
          판매 내역
        </TabButton>
      </TabWrapper>

      <TableHeader>
        <span>번호</span>
        <span>물품명</span>
        <span>거래 일시</span>
      </TableHeader>

      {activeTab === "purchase" &&
        purchaseData.length > 0 &&
        purchaseData.map((item) => (
          <Row key={item.id} onClick={() => setSelectedItem(item)}>
            <span>{item.id}</span>
            <span style={{ textAlign: "left", paddingLeft: "20px" }}>
              {item.itemName}
            </span>
            <span>{item.endTime}</span>
          </Row>
        ))}

      {activeTab === "sales" &&
        salesData.length > 0 &&
        salesData.map((item) => (
          <Row key={item.id} onClick={() => setSelectedItem(item)}>
            <span>{item.id}</span>
            <span style={{ textAlign: "left", paddingLeft: "20px" }}>
              {item.itemName}
            </span>
            <span>{item.endTime}</span>
          </Row>
        ))}

      {/* 페이지네이션 버튼 */}
      {activeTab === "purchase" && (
        <Pagination>
          <button
            onClick={() => setPurchasePage((prev) => Math.max(prev - 1, 1))}
            disabled={purchasePage === 1}
          >
            이전
          </button>
          {Array.from({ length: purchaseTotalPages }, (_, i) => (
            <button
              key={i + 1}
              className={purchasePage === i + 1 ? "active" : ""}
              onClick={() => setPurchasePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setPurchasePage((prev) => Math.min(prev + 1, purchaseTotalPages))
            }
            disabled={purchasePage === purchaseTotalPages}
          >
            다음
          </button>
        </Pagination>
      )}

      {activeTab === "sales" && (
        <Pagination>
          <button
            onClick={() => setSalesPage((prev) => Math.max(prev - 1, 1))}
            disabled={salesPage === 1}
          >
            이전
          </button>
          {Array.from({ length: salesTotalPages }, (_, i) => (
            <button
              key={i + 1}
              className={salesPage === i + 1 ? "active" : ""}
              onClick={() => setSalesPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setSalesPage((prev) => Math.min(prev + 1, salesTotalPages))
            }
            disabled={salesPage === salesTotalPages}
          >
            다음
          </button>
        </Pagination>
      )}

      {/* 상세 내역 모달 */}
      {selectedItem && (
        <ModalOverlay onClick={() => setSelectedItem(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={() => setSelectedItem(null)}
            >
              &times;
            </div>
            <h3
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              경매 상세 정보
            </h3>
            <p>
              <strong>물품명:</strong> {selectedItem.itemName}
            </p>
            <p>
              <strong>거래가:</strong> {selectedItem.finalPrice}
            </p>
            <p>
              <strong>일시:</strong> {selectedItem.endTime}
            </p>
            <p>
              <strong>상태:</strong> {selectedItem.auctionStatus}
            </p>
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "10px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AuctionHistory;
