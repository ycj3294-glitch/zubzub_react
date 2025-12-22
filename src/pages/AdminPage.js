import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

/* =========================
   Styled
========================= */

const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "dnf bitbit v2";
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
  border-bottom: 2px solid #eee;
  margin-bottom: 30px;

  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding-bottom: 10px;
    color: #aaa;

    &.active {
      color: #000;
      font-weight: bold;
      border-bottom: 2px solid #000;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Noto Sans KR";

  th,
  td {
    padding: 14px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    text-align: center;
  }

  .title {
    text-align: left;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Button = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
  font-family: inherit;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
  background: ${(p) => (p.approved ? "#000" : "#aaa")};
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #eee;
`;

const Day = styled.div`
  height: 110px;
  border: 1px solid #eee;
  padding: 8px;
  font-size: 11px;
`;

const Event = styled.div`
  background: #000;
  color: #fff;
  padding: 4px 6px;
  border-radius: 6px;
  margin-top: 5px;
  font-size: 10px;
`;

const FormBox = styled.div`
  max-width: 600px;
  border: 2px solid #000;
  border-radius: 20px;
  padding: 40px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #ddd;
`;

/* =========================
   Component
========================= */

const AdminPage = () => {
  const [menu, setMenu] = useState("회원관리");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);

  /* ===== 회원관리 ===== */
  const [members, setMembers] = useState(
    [...Array(10)].map((_, i) => ({
      id: i,
      nickname: `유저${i + 1}`,
      email: `user${i + 1}@zubzub.com`,
      status: "정상",
    }))
  );

  const [pendingStatus, setPendingStatus] = useState({});

  /* ===== 대규모 경매 ===== */
  const [auctions, setAuctions] = useState(
    [...Array(5)].map((_, i) => ({
      id: i,
      title: `대규모 경매 #${i + 1}`,
      seller: `판매자_${i + 1}`,
      approved: false,
      date: null,
    }))
  );

  /* ===== 캘린더 ===== */
  const [calendar, setCalendar] = useState({});

  /* ===== 공지사항 ===== */
  const [notices, setNotices] = useState([
    { id: 1, title: "서비스 점검 안내", date: "2025-12-01" },
    { id: 2, title: "경매 정책 변경 공지", date: "2025-12-05" },
  ]);

  const [noticeTitle, setNoticeTitle] = useState("");
  const editorRef = useRef();

  /* ========================= */

  const approveAuction = (date) => {
    setAuctions((prev) =>
      prev.map((a) =>
        a.id === selected.id ? { ...a, approved: true, date } : a
      )
    );

    setCalendar((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), selected.title],
    }));

    setView("list");
  };

  return (
    <Container>
      <h1>줍줍 관리자 페이지</h1>

      <Nav>
        {["회원관리", "대규모 경매 승인", "대규모 일정 관리", "공지 사항"].map(
          (m) => (
            <button
              key={m}
              className={menu === m ? "active" : ""}
              onClick={() => {
                setMenu(m);
                setView("list");
              }}
            >
              {m}
            </button>
          )
        )}
      </Nav>

      {/* ===== 회원관리 ===== */}
      {menu === "회원관리" && (
        <Table>
          <thead>
            <tr>
              <th>닉네임</th>
              <th>이메일</th>
              <th>상태</th>
              <th>확인</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.nickname}</td>
                <td>{m.email}</td>
                <td>
                  <select
                    value={pendingStatus[m.id] ?? m.status}
                    onChange={(e) =>
                      setPendingStatus((prev) => ({
                        ...prev,
                        [m.id]: e.target.value,
                      }))
                    }
                  >
                    <option value="정상">정상</option>
                    <option value="정지">정지</option>
                  </select>
                </td>
                <td>
                  <Button
                    disabled={pendingStatus[m.id] === undefined}
                    onClick={() => {
                      setMembers((prev) =>
                        prev.map((u) =>
                          u.id === m.id
                            ? { ...u, status: pendingStatus[m.id] }
                            : u
                        )
                      );
                      setPendingStatus((prev) => {
                        const copy = { ...prev };
                        delete copy[m.id];
                        return copy;
                      });
                    }}
                  >
                    확인
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ===== 대규모 경매 승인 ===== */}
      {menu === "대규모 경매 승인" && view === "list" && (
        <Table>
          <thead>
            <tr>
              <th>판매자</th>
              <th>제목</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((a) => (
              <tr key={a.id}>
                <td>{a.seller}</td>
                <td className="title">{a.title}</td>
                <td>
                  <Badge approved={a.approved}>
                    {a.approved ? "승인완료" : "대기"}
                  </Badge>
                </td>
                <td>
                  <Button
                    disabled={a.approved}
                    onClick={() => {
                      setSelected(a);
                      setView("schedule");
                    }}
                  >
                    일정 설정
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {view === "schedule" && selected && (
        <FormBox>
          <h2>경매 일정 설정</h2>
          <p>{selected.title}</p>
          <Input type="date" onChange={(e) => approveAuction(e.target.value)} />
          <Button onClick={() => setView("list")}>취소</Button>
        </FormBox>
      )}

      {/* ===== 대규모 일정 관리 ===== */}
      {menu === "대규모 일정 관리" && (
        <Calendar>
          {[...Array(31)].map((_, i) => {
            const dateKey = `2025-12-${String(i + 1).padStart(2, "0")}`;
            return (
              <Day key={i}>
                {i + 1}
                {calendar[dateKey]?.map((e, idx) => (
                  <Event key={idx}>{e}</Event>
                ))}
              </Day>
            );
          })}
        </Calendar>
      )}

      {/* ===== 공지사항 ===== */}
      {menu === "공지 사항" && view === "list" && (
        <>
          <Button onClick={() => setView("write")}>공지 작성</Button>
          <Table>
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>게시일</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td className="title">{n.title}</td>
                  <td>{n.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {menu === "공지 사항" && view === "write" && (
        <FormBox>
          <h2>공지사항 작성</h2>
          <Input
            placeholder="제목"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
          />

          <Editor
            ref={editorRef}
            height="300px"
            initialEditType="wysiwyg"
            previewStyle="vertical"
            placeholder="공지 내용을 입력하세요"
          />

          <Button
            onClick={() => {
              setNotices((p) => [
                {
                  id: p.length + 1,
                  title: noticeTitle,
                  date: "2025-12-22",
                },
                ...p,
              ]);
              setNoticeTitle("");
              editorRef.current.getInstance().reset();
              setView("list");
            }}
          >
            등록
          </Button>
        </FormBox>
      )}
    </Container>
  );
};

export default AdminPage;
