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
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
`;

const AdminHeader = styled.header`
  margin-bottom: 40px;
  h1 {
    font-size: 30px;
    color: #111;
    letter-spacing: -0.5px;
  }
`;

const AdminNav = styled.nav`
  display: flex;
  gap: 35px;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
  button {
    background: none;
    border: none;
    font-family: inherit;
    font-size: 17px;
    cursor: pointer;
    color: #aaa;
    position: relative;
    padding-bottom: 15px;
    transition: 0.2s;
    &.active {
      color: #000;
      font-weight: bold;
      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #000;
      }
    }
    &:hover {
      color: #666;
    }
  }
`;

const ContentBox = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 750px;
  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    h2 {
      font-size: 22px;
      color: #111;
      margin: 0;
    }
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f8f8f8;
  padding: 10px 18px;
  border-radius: 30px;
  border: 1px solid #eee;
  svg {
    color: #999;
    margin-right: 12px;
  }
  input {
    border: none;
    background: none;
    outline: none;
    font-size: 14px;
    font-family: "Noto Sans KR";
    width: 240px;
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Noto Sans KR";
  table-layout: fixed;
  th {
    text-align: center;
    padding: 15px;
    border-bottom: 1px solid #111;
    color: #333;
    font-size: 13px;
    font-family: "dnf bitbit v2";
  }
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
    color: #444;
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .title-link {
    text-align: left;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: #ddd;
    &:hover {
      color: #555;
    }
  }
`;

/* ✅ 높이 정렬 수정: 체크박스와 버튼을 감싸는 영역 */
const ApprovalArea = styled.div`
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  gap: 12px;
  height: 100%;
`;

const CustomCheckbox = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  input {
    display: none;
  }
  .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 6px;
    background: #fff;
    position: relative;
    transition: 0.2s;
    display: block; /* 높이 영향 방지 */
  }
  input:checked + .checkmark {
    background: #000;
    border-color: #000;
  }
  input:checked + .checkmark::after {
    content: "✓";
    position: absolute;
    color: #fff;
    font-size: 14px;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
  }
`;

const ActionBtn = styled.button`
  font-family: "dnf bitbit v2";
  padding: 7px 16px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #111;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
  line-height: 1.2; /* 텍스트 높이 보정 */
  &:disabled {
    background: #fff;
    color: #ccc;
    border-color: #eee;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    background: #000;
    color: #fff;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  .day-header {
    padding: 15px;
    text-align: center;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    font-size: 12px;
    color: #111;
    font-family: "dnf bitbit v2";
  }
  .day-cell {
    height: 110px;
    padding: 12px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    overflow-y: auto; /* 내용 많아지면 스크롤 */
    .date {
      font-family: "Noto Sans KR";
      font-weight: 700;
      font-size: 13px;
      color: #bbb;
      margin-bottom: 8px;
    }
  }
`;

const EventItem = styled.div`
  background: #000;
  color: #fff;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  font-family: "Noto Sans KR";
  font-weight: 500;
  margin-bottom: 4px;
  &:hover {
    opacity: 0.8;
  }
`;

const DetailPanel = styled.div`
  padding: 30px;
  border: 2px solid #000;
  border-radius: 15px;
  background: #fff;
  h3 {
    font-size: 26px;
    margin-bottom: 25px;
    border-bottom: 4px solid #000;
    display: inline-block;
    padding-bottom: 5px;
  }
  .info-list {
    list-style: none;
    padding: 0;
    font-family: "Noto Sans KR";
    li {
      display: flex;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
      .label {
        width: 140px;
        font-weight: bold;
        color: #888;
      }
      .value {
        color: #111;
      }
    }
  }
  .actions {
    margin-top: 40px;
    display: flex;
    gap: 15px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 30px;
  button {
    padding: 5px 12px;
    border: 1px solid #eee;
    background: #fff;
    cursor: pointer;
    font-family: "Noto Sans KR";
    font-size: 14px;
    &.active {
      border-color: #000;
      font-weight: bold;
      color: #000;
    }
  }
`;

/* =========================
    Main Component
========================= */

const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState("회원관리");
  const [viewMode, setViewMode] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmedIds, setConfirmedIds] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ⚠️ 더미데이터 완전 복구 및 경매 일정 추가 데이터
  const members = [...Array(32)].map((_, i) => ({
    id: `m${i}`,
    name: `유저_${i + 1}`,
    email: `user${i + 1}@zubzub.com`,
    coin: "250,000 ZC",
  }));
  const coins = [...Array(12)].map((_, i) => ({
    id: `c${i}`,
    name: `입금자_${i + 1}`,
    title: `[충전] 100,000 ZC 신청 건`,
    price: "100,000원",
    date: "2023-12-18",
  }));
  const auctions = [...Array(18)].map((_, i) => ({
    id: `a${i}`,
    name: `판매자_${i + 1}`,
    title: `[대규모] 레어 콜렉션 #${i + 1} 경매`,
    price: "500,000 ZC",
    desc: "검수 완료 상품",
    date: "2023-12-20",
  }));
  const notices = [...Array(14)].map((_, i) => ({
    id: 14 - i,
    title: `줍줍 서비스 공지사항 #${14 - i}`,
    date: "2023-12-18",
  }));

  // ✅ 일정 데이터 대폭 추가
  const calendarEvents = {
    1: [{ title: "신년 한정판 옥션" }],
    5: [{ title: "구찌 빈티지 백" }, { title: "루이비통 지갑" }],
    12: [{ title: "나이키 조던 오프화이트" }],
    18: [
      {
        title: "연말 결산 럭키박스",
        name: "관리자",
        price: "0 ZC",
        desc: "비동기 상세 내용",
      },
    ],
    20: [{ title: "롤렉스 서브마리너" }],
    24: [{ title: "이브 특별 나눔" }],
    25: [
      {
        title: "성탄절 한정판 옥션",
        name: "ZubZub",
        price: "1,000,000 ZC",
        desc: "이벤트 경매",
      },
    ],
    31: [{ title: "카운트다운 이벤트" }],
  };

  const getFilteredData = () => {
    let base =
      activeMenu === "회원관리"
        ? members
        : activeMenu === "회원 줍코인 승인"
        ? coins
        : activeMenu === "대규모 경매 승인"
        ? auctions
        : notices;
    if (!searchTerm) return base;
    return base.filter((d) => (d.name || d.title || "").includes(searchTerm));
  };

  const currentData = getFilteredData();
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setViewMode("detail");
  };

  useEffect(() => {
    setViewMode("list");
    setSearchTerm("");
    setCurrentPage(1);
  }, [activeMenu]);

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>줍줍 관리자 서비스</h1>
      </AdminHeader>
      <AdminNav>
        {[
          "회원관리",
          "회원 줍코인 승인",
          "대규모 경매 승인",
          "대규모 일정 관리",
          "공지 사항",
        ].map((m) => (
          <button
            key={m}
            className={activeMenu === m ? "active" : ""}
            onClick={() => setActiveMenu(m)}
          >
            {m}
          </button>
        ))}
      </AdminNav>

      <ContentBox>
        {viewMode === "list" ? (
          <>
            <div className="box-header">
              <h2>{activeMenu}</h2>
              {activeMenu !== "대규모 일정 관리" && (
                <SearchWrapper>
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <input
                    placeholder="검색어를 입력해 주세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </SearchWrapper>
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
                      {calendarEvents[i + 1]?.map((ev, idx) => (
                        <EventItem
                          key={idx}
                          onClick={() => handleOpenDetail(ev)}
                        >
                          {ev.title}
                        </EventItem>
                      ))}
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
                          <th>상태변경</th>
                        </tr>
                      )}
                      {(activeMenu === "회원 줍코인 승인" ||
                        activeMenu === "대규모 경매 승인") && (
                        <tr>
                          <th>신청자</th>
                          <th>제목</th>
                          <th>금액</th>
                          <th>승인관리</th>
                        </tr>
                      )}
                      {activeMenu === "공지 사항" && (
                        <tr>
                          <th>No</th>
                          <th>제목</th>
                          <th>게시일</th>
                          <th>관리</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr key={item.id}>
                          {activeMenu === "회원관리" && (
                            <>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.coin}</td>
                              <td>
                                <select>
                                  <option>정상</option>
                                  <option>정지</option>
                                </select>
                              </td>
                            </>
                          )}
                          {(activeMenu === "회원 줍코인 승인" ||
                            activeMenu === "대규모 경매 승인") && (
                            <>
                              <td>{item.name}</td>
                              <td
                                className="title-link"
                                onClick={() => handleOpenDetail(item)}
                              >
                                {item.title}
                              </td>
                              <td>{item.price}</td>
                              <td>
                                {/* ✅ 높이 정렬 보정된 영역 */}
                                <ApprovalArea>
                                  <CustomCheckbox>
                                    <input
                                      type="checkbox"
                                      checked={!!confirmedIds[item.id]}
                                      onChange={() =>
                                        setConfirmedIds((prev) => ({
                                          ...prev,
                                          [item.id]: !prev[item.id],
                                        }))
                                      }
                                    />
                                    <span className="checkmark"></span>
                                  </CustomCheckbox>
                                  <ActionBtn
                                    disabled={!confirmedIds[item.id]}
                                    onClick={() => alert("처리 완료")}
                                  >
                                    승인
                                  </ActionBtn>
                                </ApprovalArea>
                              </td>
                            </>
                          )}
                          {activeMenu === "공지 사항" && (
                            <>
                              <td>{item.id}</td>
                              <td className="title-link">{item.title}</td>
                              <td>{item.date}</td>
                              <td>
                                <ActionBtn
                                  style={{ color: "red", borderColor: "red" }}
                                >
                                  삭제
                                </ActionBtn>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </AdminTable>
                  <Pagination>
                    {[
                      ...Array(Math.ceil(currentData.length / itemsPerPage)),
                    ].map((_, i) => (
                      <button
                        key={i}
                        className={currentPage === i + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </Pagination>
                </>
              )}
            </TableWrapper>
          </>
        ) : (
          <DetailPanel>
            <h3>상세 정보</h3>
            <ul className="info-list">
              <li>
                <span className="label">항목</span>
                <span className="value">{selectedItem.title}</span>
              </li>
              <li>
                <span className="label">이름</span>
                <span className="value">{selectedItem.name || "시스템"}</span>
              </li>
              <li>
                <span className="label">금액</span>
                <span className="value">
                  {selectedItem.price || "별도 표기"}
                </span>
              </li>
              <li>
                <span className="label">상세</span>
                <span className="value">
                  {selectedItem.desc || "상세 정보가 없습니다."}
                </span>
              </li>
            </ul>
            <div className="actions">
              <ActionBtn onClick={() => setViewMode("list")}>닫기</ActionBtn>
              <ActionBtn
                style={{ background: "#000", color: "#fff" }}
                onClick={() => {
                  alert("최종 승인!");
                  setViewMode("list");
                }}
              >
                최종 승인
              </ActionBtn>
            </div>
          </DetailPanel>
        )}
      </ContentBox>
    </AdminContainer>
  );
};

export default AdminPage;
