import { useState } from "react";
import styled from "styled-components";

/* =====================
   Tab Types
===================== */

const TABS = {
  USER: "USER",
  COIN: "COIN",
  AUCTION: "AUCTION",
  SCHEDULE: "SCHEDULE",
  NOTICE: "NOTICE",
};

/* =====================
   Dummy Data
===================== */

const USERS = Array.from({ length: 10 }, () => ({
  nickname: "LEETS",
  email: "55029564@gmail.com",
  coin: 100000,
}));

const COIN_REQUESTS = Array.from({ length: 10 }, () => ({
  nickname: "LEETS",
  request: 300000,
  current: 100000,
}));

const AUCTION_REQUESTS = Array.from({ length: 10 }, () => ({
  nickname: "LEETS",
  title: "WHY? 책 상태 A급 20권 묶음",
  price: 40000,
}));

/* =====================
   styled
===================== */

const Container = styled.div`
  max-width: 1280px;
  margin: 40px auto;
  padding: 0 16px;
`;

const PageTitle = styled.h1`
  margin-bottom: 24px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: ${(props) => (props.active ? "#111" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#111")};
  cursor: pointer;
`;

const Section = styled.section`
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2``;

const Search = styled.input`
  padding: 6px 10px;
`;

/* ===== Table ===== */

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 6px;
`;

const Select = styled.select`
  padding: 4px;
`;

const Button = styled.button`
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
`;

/* ===== Pagination ===== */

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

/* =====================
   Component
===================== */

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.USER);

  return (
    <Container>
      <PageTitle>줍줍 관리자 페이지</PageTitle>

      {/* 탭 */}
      <Tabs>
        <Tab
          active={activeTab === TABS.USER}
          onClick={() => setActiveTab(TABS.USER)}
        >
          회원관리
        </Tab>
        <Tab
          active={activeTab === TABS.COIN}
          onClick={() => setActiveTab(TABS.COIN)}
        >
          회원 줍코인 승인
        </Tab>
        <Tab
          active={activeTab === TABS.AUCTION}
          onClick={() => setActiveTab(TABS.AUCTION)}
        >
          대규모 경매 승인
        </Tab>
        <Tab
          active={activeTab === TABS.SCHEDULE}
          onClick={() => setActiveTab(TABS.SCHEDULE)}
        >
          대규모 경매 일정
        </Tab>
        <Tab
          active={activeTab === TABS.NOTICE}
          onClick={() => setActiveTab(TABS.NOTICE)}
        >
          공지 사항
        </Tab>
      </Tabs>

      {/* ================= 회원관리 ================= */}
      {activeTab === TABS.USER && (
        <Section>
          <SectionHeader>
            <SectionTitle>회원관리</SectionTitle>
            <Search placeholder="검색" />
          </SectionHeader>

          <TableHeader>
            <span>회원 닉네임</span>
            <span>이메일</span>
            <span>보유 줍코인</span>
            <span>회원 상태</span>
          </TableHeader>

          {USERS.map((user, idx) => (
            <Row key={idx}>
              <span>{user.nickname}</span>
              <span>{user.email}</span>
              <span>{user.coin.toLocaleString()} 코인</span>
              <ActionRow>
                <Select>
                  <option>활성</option>
                  <option>정지</option>
                </Select>
                <Button>저장</Button>
              </ActionRow>
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
        </Section>
      )}

      {/* ================= 줍코인 승인 ================= */}
      {activeTab === TABS.COIN && (
        <Section>
          <SectionHeader>
            <SectionTitle>줍코인 승인</SectionTitle>
            <Search placeholder="검색" />
          </SectionHeader>

          <TableHeader>
            <span>회원 닉네임</span>
            <span>신청 줍코인</span>
            <span>보유 줍코인</span>
            <span>승인 대기</span>
          </TableHeader>

          {COIN_REQUESTS.map((req, idx) => (
            <Row key={idx}>
              <span>{req.nickname}</span>
              <span>{req.request.toLocaleString()} 코인</span>
              <span>{req.current.toLocaleString()} 코인</span>
              <ActionRow>
                <Button>승인</Button>
                <Button>거절</Button>
              </ActionRow>
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
        </Section>
      )}

      {/* ================= 대규모 경매 승인 ================= */}
      {activeTab === TABS.AUCTION && (
        <Section>
          <SectionHeader>
            <SectionTitle>대규모 경매 승인</SectionTitle>
            <Search placeholder="검색" />
          </SectionHeader>

          <TableHeader>
            <span>회원 닉네임</span>
            <span>상품 이름</span>
            <span>상품 입찰가</span>
            <span>승인 대기</span>
          </TableHeader>

          {AUCTION_REQUESTS.map((auction, idx) => (
            <Row key={idx}>
              <span>{auction.nickname}</span>
              <span>{auction.title}</span>
              <span>{auction.price.toLocaleString()} 원</span>
              <ActionRow>
                <Button>승인</Button>
                <Button>거절</Button>
              </ActionRow>
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
        </Section>
      )}

      {/* ================= 대규모 경매 일정 ================= */}
      {activeTab === TABS.SCHEDULE && (
        <Section>
          <SectionTitle>대규모 경매 일정</SectionTitle>
          <p>📅 캘린더 UI 예정</p>
        </Section>
      )}

      {/* ================= 공지 사항 ================= */}
      {activeTab === TABS.NOTICE && (
        <Section>
          <SectionTitle>공지 사항</SectionTitle>
          <p>📢 공지 관리 UI 예정</p>
        </Section>
      )}
    </Container>
  );
};

export default AdminPage;
