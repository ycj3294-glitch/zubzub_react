import React, { useState } from "react";
import styled from "styled-components";

/* =====================
   Styled
===================== */

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
  margin-right: 6px;

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
  cursor: pointer;
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

const Select = styled.select`
  padding: 6px;
`;

/* =====================
   Component
===================== */

const AdminPage = () => {
  const [menu, setMenu] = useState("회원관리");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);

  /* ===== 회원관리 ===== */
  const [members, setMembers] = useState(
    [...Array(5)].map((_, i) => ({
      id: i,
      nickname: `유저${i + 1}`,
      email: `user${i + 1}@zubzub.com`,
      status: "정상",
    }))
  );

  /* ===== 대규모 경매 ===== */
  const [auctions, setAuctions] = useState(
    [...Array(4)].map((_, i) => ({
      id: i,
      title: `대규모 경매 #${i + 1}`,
      seller: `판매자_${i + 1}`,
      approved: false,
      schedule: null,
    }))
  );

  /* ===== 일정 ===== */
  const [calendar, setCalendar] = useState({});
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [editingSchedule, setEditingSchedule] = useState(null);

  /* =====================
     일정 확정 (신규 + 수정 공통)
  ===================== */
  const confirmSchedule = () => {
    setCalendar((prev) => {
      let updated = { ...prev };

      // 🔥 수정이면 기존 일정 제거
      if (editingSchedule) {
        updated[editingSchedule.date] = updated[editingSchedule.date].filter(
          (e) => e.id !== editingSchedule.id
        );

        if (updated[editingSchedule.date].length === 0) {
          delete updated[editingSchedule.date];
        }
      }

      // 🔥 새 일정 추가
      updated[scheduleDate] = [
        ...(updated[scheduleDate] || []),
        {
          id: selected.id,
          title: selected.title,
          time: scheduleTime,
        },
      ];

      return updated;
    });

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === selected.id
          ? {
              ...a,
              approved: true,
              schedule: { date: scheduleDate, time: scheduleTime },
            }
          : a
      )
    );

    setView("list");
    setEditingSchedule(null);
    setScheduleDate("");
    setScheduleTime("");
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
                  <Select
                    value={m.status}
                    onChange={(e) =>
                      setMembers((prev) =>
                        prev.map((u) =>
                          u.id === m.id ? { ...u, status: e.target.value } : u
                        )
                      )
                    }
                  >
                    <option>정상</option>
                    <option>정지</option>
                  </Select>
                </td>
                <td>
                  <Button onClick={() => alert("상태 변경 완료")}>확인</Button>
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
                <td>{a.title}</td>
                <td>
                  <Badge approved={a.approved}>
                    {a.approved ? "승인완료" : "대기"}
                  </Badge>
                </td>
                <td>
                  <Button
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

      {/* ===== 일정 설정 ===== */}
      {view === "schedule" && selected && (
        <FormBox>
          <h2>경매 일정 설정</h2>
          <p>{selected.title}</p>
          <Input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
          <Input
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />
          <Button onClick={confirmSchedule}>확인</Button>
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
                {calendar[dateKey]?.map((e) => (
                  <Event
                    key={e.id}
                    onClick={() => {
                      setSelected(auctions.find((a) => a.id === e.id));
                      setEditingSchedule({
                        id: e.id,
                        date: dateKey,
                      });
                      setScheduleDate(dateKey);
                      setScheduleTime(e.time);
                      setView("schedule");
                    }}
                  >
                    {e.title} ({e.time})
                  </Event>
                ))}
              </Day>
            );
          })}
        </Calendar>
      )}
    </Container>
  );
};

export default AdminPage;
