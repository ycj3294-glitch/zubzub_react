import React, { useState, useEffect } from "react";
import styled from "styled-components";

/* =========================
   Styled Components
========================= */

const AdminContainer = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "dnf bitbit v2", sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
  box-sizing: border-box;
`;

const AdminHeader = styled.header`
  margin-bottom: 30px;
  h1 {
    font-size: 28px;
    color: #000;
  }
`;

const AdminNav = styled.nav`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;

  button {
    background: none;
    border: none;
    font-family: inherit;
    font-size: 16px;
    cursor: pointer;
    color: #888;
    position: relative;
    padding-bottom: 8px;
    &.active {
      color: #000;
      font-weight: bold;
      &::after {
        content: "";
        position: absolute;
        bottom: -11px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #000;
      }
    }
  }
`;

/* 컨텐츠 박스: 높이를 '고정(height)'하여 데이터 양에 상관없이 크기 유지 */
const ContentBox = styled.section`
  background: #fff;
  border-radius: 15px;
  border: 1px solid #eee;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  height: 680px; /* 전체 박스 높이 절대 고정 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  animation: fadeIn 0.3s ease-in-out;

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h2 {
      font-size: 20px;
      margin: 0;
    }
  }
`;

/* 테이블 영역: 이 영역이 고정 높이를 가짐으로써 데이터가 없어도 공간을 차지함 */
const TableWrapper = styled.div`
  flex: 1; /* 남은 공간을 다 차지함 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 450px; /* 테이블 본문 영역 최소 높이 */
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 13px;

  th {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 2px solid #f5f5f5;
    color: #666;
    font-family: "dnf bitbit v2", sans-serif;
    font-weight: normal;
  }

  td {
    padding: 6px 12px; /* 패딩을 더 줄여서 촘촘하게 만듦 */
    border-bottom: 1px solid #f9f9f9;
    color: #333;
    height: 35px; /* 행 높이를 작게 고정 */
    vertical-align: middle;
  }

  .link-text {
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: #0056b3;
    }
  }

  select,
  .row-btn {
    font-family: "Noto Sans KR", sans-serif;
    padding: 2px 6px;
    font-size: 11px;
    border-radius: 3px;
    border: 1px solid #ddd;
    cursor: pointer;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: auto; /* 박스 바닥에 딱 붙게 함 */
  padding-top: 20px;
  font-family: "Noto Sans KR", sans-serif;

  button {
    background: #fff;
    border: 1px solid #eee;
    padding: 4px 10px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    min-width: 32px;
    &.active {
      background: #000;
      color: #fff;
      border-color: #000;
      font-weight: bold;
    }
    &:disabled {
      color: #ccc;
      cursor: not-allowed;
      border-color: #f1f1f1;
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  font-family: "Noto Sans KR", sans-serif;

  .day-header {
    background: #fdfdfd;
    padding: 10px;
    text-align: center;
    border: 1px solid #eee;
    border-top: none;
    border-left: none;
    font-size: 11px;
    color: #888;
    font-family: "dnf bitbit v2", sans-serif;
  }
  .day-cell {
    height: 85px;
    padding: 6px;
    border: 1px solid #eee;
    border-top: none;
    border-left: none;
    .date {
      font-weight: bold;
      color: #555;
      margin-bottom: 4px;
      font-size: 12px;
    }
    .event {
      background: #eef2ff;
      color: #3b82f6;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 10px;
      margin-top: 2px;
      cursor: pointer;
      border: 1px solid #dbeafe;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        background: #dbeafe;
      }
    }
  }
`;

const ActionBtn = styled.button`
  padding: 8px 18px;
  border-radius: 5px;
  font-family: "dnf bitbit v2", sans-serif;
  cursor: pointer;
  border: none;
  font-size: 13px;
  background: ${(props) => (props.black ? "#000" : "#eee")};
  color: ${(props) => (props.black ? "#fff" : "#333")};
`;

const DetailView = styled.div`
  font-family: "Noto Sans KR", sans-serif;
  .info-row {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    .label {
      width: 140px;
      font-weight: bold;
      color: #666;
    }
    .value {
      color: #111;
    }
  }
`;

/* =========================
   Main Component
========================= */

const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState("회원관리");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 10;

  // 데이터 보강
  const members = [...Array(32)].map((_, i) => ({
    id: i + 1,
    name: `유저_${i + 1}`,
    email: `user${i + 1}@zubzub.com`,
    coin: "250,000 ZC",
  }));
  const coins = [...Array(12)].map((_, i) => ({
    id: i + 1,
    name: `입금자_${i + 1}`,
    amount: "100,000 ZC",
    price: "100,000원",
  }));
  const auctions = [...Array(18)].map((_, i) => ({
    id: i + 1,
    seller: `판매자_${i + 1}`,
    title: `[대규모] 레어 콜렉션 #${i + 1}`,
    price: "500,000 ZC",
    desc: "이 상품은 특별 한정판으로 제작된 상품입니다.",
  }));
  const notices = [...Array(14)].map((_, i) => ({
    id: 14 - i,
    title: `공지사항 테스트입니다 ${14 - i}`,
    date: "2023-12-18",
  }));

  // 캘린더 데이터 대폭 추가
  const calendarEvents = {
    1: { title: "새해 첫 한정판 경매", seller: "ZubZub_KR" },
    3: { title: "샤넬 팝업 경매", seller: "Luxury_H" },
    5: { title: "빈티지 롤렉스", seller: "WatchMan" },
    7: { title: "나이키 오프화이트", seller: "SneakerHead" },
    12: { title: "애플 빈티지 맥북", seller: "TechCollector" },
    14: { title: "다이아몬드 반지", seller: "Jewelry_King" },
    15: { title: "대규모 연말결산", seller: "Admin" },
    20: { title: "레고 스타워즈", seller: "BrickMania" },
    24: { title: "크리스마스 경매", seller: "Santa_Zub" },
    25: { title: "연휴 특별 물품", seller: "ZubZub" },
    28: { title: "럭키박스 이벤트", seller: "Admin_Box" },
    31: { title: "카운트다운 옥션", seller: "ZubZub" },
  };

  useEffect(() => {
    setCurrentPage(1);
    setViewMode("list");
  }, [activeMenu]);

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageRange = 5;
    const currentGroup = Math.ceil(currentPage / pageRange);
    const startPage = (currentGroup - 1) * pageRange + 1;
    const endPage = Math.min(startPage + pageRange - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <Pagination>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </Pagination>
    );
  };

  const getPaginatedData = (data) =>
    data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const openDetail = (item) => {
    setSelectedItem(item);
    setViewMode("detail");
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>줍줍 관리자 페이지</h1>
      </AdminHeader>
      <AdminNav>
        {[
          "회원관리",
          "회원 줍코인 승인",
          "대규모 경매 승인",
          "대규모 일정 관리",
          "공지 사항",
        ].map((menu) => (
          <button
            key={menu}
            className={activeMenu === menu ? "active" : ""}
            onClick={() => setActiveMenu(menu)}
          >
            {menu}
          </button>
        ))}
      </AdminNav>

      <ContentBox>
        {viewMode === "list" && (
          <>
            <div className="box-header">
              <h2>{activeMenu}</h2>
              {activeMenu === "공지 사항" && (
                <ActionBtn black onClick={() => setViewMode("write")}>
                  공지 작성
                </ActionBtn>
              )}
            </div>

            <TableWrapper>
              {activeMenu === "대규모 일정 관리" ? (
                <CalendarGrid>
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                    (d) => (
                      <div key={d} className="day-header">
                        {d}
                      </div>
                    )
                  )}
                  {[...Array(31)].map((_, i) => (
                    <div key={i} className="day-cell">
                      <div className="date">{i + 1}</div>
                      {calendarEvents[i + 1] && (
                        <div
                          className="event"
                          onClick={() =>
                            openDetail({
                              title: calendarEvents[i + 1].title,
                              seller: calendarEvents[i + 1].seller,
                              price: "상세문의",
                              desc: "캘린더 전용 경매 물품입니다.",
                            })
                          }
                        >
                          {calendarEvents[i + 1].title}
                        </div>
                      )}
                    </div>
                  ))}
                </CalendarGrid>
              ) : (
                <>
                  <AdminTable>
                    <thead>
                      {activeMenu === "회원관리" && (
                        <tr>
                          <th>닉네임</th>
                          <th>이메일</th>
                          <th>보유코인</th>
                          <th>상태</th>
                        </tr>
                      )}
                      {activeMenu === "회원 줍코인 승인" && (
                        <tr>
                          <th>신청자</th>
                          <th>코인</th>
                          <th>입금액</th>
                          <th>처리</th>
                        </tr>
                      )}
                      {activeMenu === "대규모 경매 승인" && (
                        <tr>
                          <th>판매자</th>
                          <th>상품명</th>
                          <th>가격</th>
                          <th>관리</th>
                        </tr>
                      )}
                      {activeMenu === "공지 사항" && (
                        <tr>
                          <th>번호</th>
                          <th>제목</th>
                          <th>날짜</th>
                          <th>관리</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {activeMenu === "회원관리" &&
                        getPaginatedData(members).map((m) => (
                          <tr key={m.id}>
                            <td>{m.name}</td>
                            <td>{m.email}</td>
                            <td>{m.coin}</td>
                            <td>
                              <select>
                                <option>정상</option>
                                <option>정지</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      {activeMenu === "회원 줍코인 승인" &&
                        getPaginatedData(coins).map((c) => (
                          <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.amount}</td>
                            <td>{c.price}</td>
                            <td>
                              <button className="row-btn">승인</button>
                            </td>
                          </tr>
                        ))}
                      {activeMenu === "대규모 경매 승인" &&
                        getPaginatedData(auctions).map((a) => (
                          <tr key={a.id}>
                            <td>{a.seller}</td>
                            <td
                              className="link-text"
                              onClick={() => openDetail(a)}
                            >
                              {a.title}
                            </td>
                            <td>{a.price}</td>
                            <td>
                              <button className="row-btn">승인</button>
                            </td>
                          </tr>
                        ))}
                      {activeMenu === "공지 사항" &&
                        getPaginatedData(notices).map((n) => (
                          <tr key={n.id}>
                            <td>{n.id}</td>
                            <td>{n.title}</td>
                            <td>{n.date}</td>
                            <td>
                              <button
                                style={{
                                  color: "red",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                삭제
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </AdminTable>
                  {renderPagination(
                    activeMenu === "회원관리"
                      ? members.length
                      : activeMenu === "회원 줍코인 승인"
                      ? coins.length
                      : activeMenu === "대규모 경매 승인"
                      ? auctions.length
                      : notices.length
                  )}
                </>
              )}
            </TableWrapper>
          </>
        )}

        {viewMode === "detail" && selectedItem && (
          <DetailView>
            <div className="box-header">
              <h2>상세 정보</h2>
              <ActionBtn onClick={() => setViewMode("list")}>닫기</ActionBtn>
            </div>
            <div className="info-row">
              <div className="label">상품명</div>
              <div className="value">{selectedItem.title}</div>
            </div>
            <div className="info-row">
              <div className="label">판매자</div>
              <div className="value">{selectedItem.seller}</div>
            </div>
            <div className="info-row">
              <div className="label">시작 가격</div>
              <div className="value">{selectedItem.price}</div>
            </div>
            <div className="info-row">
              <div className="label">설명</div>
              <div className="value">{selectedItem.desc}</div>
            </div>
            <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
              <ActionBtn black onClick={() => setViewMode("list")}>
                최종 승인
              </ActionBtn>
            </div>
          </DetailView>
        )}
      </ContentBox>
    </AdminContainer>
  );
};

export default AdminPage;
