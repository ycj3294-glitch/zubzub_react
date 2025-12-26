import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import AxiosApi from "../api/AxiosAPI";
import { createMessage } from "../api/AxiosAPI";

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
// 화면 전체를 어둡게 덮는 배경
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); // 반투명 검정
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000; // 다른 요소보다 위에 보이게 함
`;

// 중앙에 흰색 박스
const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 450px;
  border: 2px solid #000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-family: "dnf bitbit v2";
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-family: "Noto Sans KR";
    font-weight: bold;
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
    vertical-align: middle;
  }

  .title {
    text-align: left;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
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
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  border-color: #e74c3c;
  color: #e74c3c;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
  background: ${(p) => (p.approved ? "#000" : "#aaa")};
`;

const FormBox = styled.div`
  max-width: 900px;
  border: 2px solid #000;
  border-radius: 20px;
  padding: 40px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin: 12px 0 18px;
  border-radius: 12px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  font-family: "Noto Sans KR";
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;

  label {
    font-family: "Noto Sans KR";
    font-size: 13px;
    color: #666;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #eee;
`;

const Day = styled.div`
  height: 120px;
  border: 1px solid #eee;
  padding: 8px;
  font-size: 11px;
  overflow: hidden;
`;

const Event = styled.div`
  background: #000;
  color: #fff;
  padding: 4px 6px;
  border-radius: 6px;
  margin-top: 6px;
  font-size: 10px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  .left {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .right {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

/* =========================
   Helpers
========================= */

const pad2 = (n) => String(n).padStart(2, "0");

/** 캘린더 key: "YYYY-MM-DD" */
const toDateKey = (yyyy, mm, dd) => `${yyyy}-${pad2(mm)}-${pad2(dd)}`;

/** 일정 key(캘린더 저장): dateKey로 그룹 + 내부 배열로 관리 */
const formatScheduleLabel = (auction) => {
  if (!auction?.schedule?.date) return "(미설정)";
  return `${auction.schedule.date} ${auction.schedule.time || ""}`.trim();
};

/* =========================
   Component
========================= */

const AdminPage = () => {
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgTarget, setMsgTarget] = useState({
    id: null,
    nickname: "",
    isAll: false,
  });
  const [msgForm, setMsgForm] = useState({ title: "", content: "" });
  const MENUS = useMemo(
    () => ["회원관리", "대규모 경매 승인", "대규모 일정 관리", "공지 사항"],
    []
  );

  const [menu, setMenu] = useState("회원관리");

  /** view는 메뉴별로 다르게 사용 */
  const [view, setView] = useState("list"); // list | scheduleForm | scheduleDetail | noticeWrite | noticeDetail | noticeEdit
  const [selected, setSelected] = useState(null);

  /* =========================
     1) 회원관리 (더미 유지)
  ========================= */
  // 1. 처음엔 빈 배열로 시작합니다.
  const [members, setMembers] = useState([]);

  // 2. 데이터를 가져오는 함수와 useEffect 추가
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // ❗ 수정: memberList -> getAllMembers
        const response = await AxiosApi.getAllMembers();
        console.log("백엔드 원본 데이터:", response.data);

        const mappedData = response.data.map((m) => ({
          ...m,
          // 백엔드 필드명이 memberStatus가 맞는지 확인 필요 (보통 status일 때도 있음)
          pendingStatus: m.memberStatus === "ACTIVE" ? "정상" : "정지",
        }));
        setMembers(mappedData);
      } catch (error) {
        console.error("회원 목록을 가져오는데 실패했습니다.", error);
      }
    };

    if (menu === "회원관리") {
      fetchMembers();
    }
  }, [menu]);

  const handleSendMessage = async () => {
    if (!msgForm.title.trim() || !msgForm.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    try {
      if (false && msgTarget.isAll) {
        // await sendMessage(msgForm);
        alert("모든 회원에게 쪽지를 발송했습니다.");
      } else {
        await createMessage({
          receiverId: msgTarget.id,
          title: msgForm.title,
          content: msgForm.content,
        });
        alert(`${msgTarget.nickname}님에게 쪽지를 발송했습니다.`);
      }
      setIsMsgModalOpen(false);
      setMsgForm({ title: "", content: "" });
    } catch (e) {
      alert("쪽지 발송에 실패했습니다.");
    }
  };
  /* =========================
     2) 대규모 경매 승인 (더미 유지)
     - approved:false 목록에서 일정 설정 → 확인으로 승인
  ========================= */

  // const [auctions, setAuctions] = useState(
  //   [...Array(6)].map((_, i) => ({
  //     id: i,
  //     title: `대규모 경매 #${i + 1}`,
  //     seller: `판매자_${i + 1}`,
  //     approved: false,
  //     schedule: {
  //       date: null, // "YYYY-MM-DD"
  //       time: null, // "HH:mm"
  //     },
  //   }))
  // );

  // 실제 경매 승인 대기 데이터 받아오기
  const [auctions, setAuctions] = useState([]);
  useEffect(() => {
    console.log("useEffect 실행됨");
    console.log(AxiosApi.getPendingAuctions);
    AxiosApi.getPendingAuctions()
      .then((response) => {
        setAuctions(response.data);
      })
      .catch((error) => {
        console.error("승인대기 목록을 받아오지 못했습니다.", error);
      });
  }, []);

  /* =========================
     3) 대규모 일정 관리
     - calendar는 dateKey별 이벤트 배열
     - 수정 시 "추가"가 아니라 "교체" 되도록 구현
  ========================= */

  const [calendar, setCalendar] = useState({}); // { "2025-12-05": [{ auctionId, title, time }] }

  // 일정 입력 상태(승인용/수정용 공통 사용)
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // 일정 수정 모드에서 "기존 위치" 기억 (교체 위해)
  const [editingInfo, setEditingInfo] = useState(null);
  // { auctionId, prevDateKey }

  /* =========================
     4) 공지사항 (Toast Editor)
     - 목록/작성/상세/수정/삭제
     - 더미 유지
  ========================= */

  const editorRef = useRef(null);
  const [notices, setNotices] = useState([
    {
      id: 3,
      title: "서비스 점검 안내",
      content: "<p>12월 25일 서버 점검이 예정되어 있습니다.</p>",
      date: "2025-12-01",
    },
    {
      id: 2,
      title: "경매 정책 변경 공지",
      content: "<p>경매 정책이 일부 변경되었습니다. 상세 내용은 본문 참고.</p>",
      date: "2025-12-05",
    },
    {
      id: 1,
      title: "신규 기능 업데이트",
      content: "<p>쪽지함 기능이 추가되었습니다.</p>",
      date: "2025-12-10",
    },
  ]);

  const [noticeTitle, setNoticeTitle] = useState("");

  /* =========================
     Menu 전환 시 view 초기화
  ========================= */

  useEffect(() => {
    setView("list");
    setSelected(null);
    setEditingInfo(null);
    setScheduleDate("");
    setScheduleTime("");
    setNoticeTitle("");
  }, [menu]);

  /* =========================
     일정 저장/승인 로직
  ========================= */

  const addEventToCalendar = (auctionId, title, dateKey, time) => {
    setCalendar((prev) => {
      const list = prev[dateKey] ? [...prev[dateKey]] : [];
      // 같은 auctionId가 같은 날짜에 이미 있으면 교체
      const idx = list.findIndex((x) => x.auctionId === auctionId);
      if (idx >= 0) list[idx] = { auctionId, title, time };
      else list.push({ auctionId, title, time });
      return { ...prev, [dateKey]: list };
    });
  };

  const removeEventFromCalendar = (auctionId, dateKey) => {
    setCalendar((prev) => {
      const list = prev[dateKey] ? [...prev[dateKey]] : [];
      const next = list.filter((x) => x.auctionId !== auctionId);
      const copy = { ...prev };
      if (next.length === 0) delete copy[dateKey];
      else copy[dateKey] = next;
      return copy;
    });
  };

  const findEventDateKeyByAuctionId = (auctionId) => {
    const keys = Object.keys(calendar);
    for (const k of keys) {
      if ((calendar[k] || []).some((e) => e.auctionId === auctionId)) return k;
    }
    return null;
  };

  /** 승인(일정 설정 confirm) */
  const confirmApproveWithSchedule = async () => {
    if (!selected) return;
    if (!scheduleDate || !scheduleTime) {
      alert("날짜와 시간을 모두 선택해 주세요.");
      return;
    }

    const startTime = `${scheduleDate}T${scheduleTime}`;

    try {
      // 1️⃣ 백엔드 승인 요청 (startTime만)
      console.log("승인 요청 보내기:", selected.id, startTime);
      await AxiosApi.approveAuction(selected.id, startTime);
      // 1) auctions 승인 + schedule 저장
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

      // 2) calendar 등록 (승인 시점에만 캘린더 반영)
      addEventToCalendar(
        selected.id,
        selected.itemName,
        scheduleDate,
        scheduleTime
      );

      setView("list");
      setSelected(null);
      setScheduleDate("");
      setScheduleTime("");

      // 메시지 출력
      alert("경매가 승인되고 일정이 등록되었습니다.");
    } catch (error) {
      console.error("승인 실패:", error);
      alert("승인에 실패했습니다.");
    }
  };

  /** 일정 관리에서 수정 confirm (교체) */
  const confirmUpdateSchedule = () => {
    if (!selected) return;
    if (!scheduleDate || !scheduleTime) {
      alert("날짜와 시간을 모두 선택해 주세요.");
      return;
    }
    if (!editingInfo?.prevDateKey) return;

    const auctionId = selected.id;
    const prevKey = editingInfo.prevDateKey;

    // 1) calendar: 이전 위치 제거 → 새 위치 추가 (교체)
    removeEventFromCalendar(auctionId, prevKey);
    addEventToCalendar(auctionId, selected.title, scheduleDate, scheduleTime);

    // 2) auctions의 schedule도 같이 갱신
    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? { ...a, schedule: { date: scheduleDate, time: scheduleTime } }
          : a
      )
    );

    setView("list");
    setSelected(null);
    setEditingInfo(null);
    setScheduleDate("");
    setScheduleTime("");
  };

  /** 일정 취소(캘린더에서 제거 + 승인상태 되돌릴지? -> 일단 일정만 제거하고 승인 유지/또는 승인 취소 선택 가능)
   *  여기서는 "일정 취소"를 일정 삭제로 처리 + 승인도 false로 롤백(원하면 유지로 바꿔도 됨)
   */
  const cancelSchedule = () => {
    if (!selected) return;

    const auctionId = selected.id;
    const dateKey = findEventDateKeyByAuctionId(auctionId);
    if (dateKey) removeEventFromCalendar(auctionId, dateKey);

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              approved: false,
              schedule: { date: null, time: null },
            }
          : a
      )
    );

    setView("list");
    setSelected(null);
    setEditingInfo(null);
    setScheduleDate("");
    setScheduleTime("");
  };

  /* =========================
     공지사항 로직
  ========================= */

  const openNoticeWrite = () => {
    setNoticeTitle("");
    setSelected(null);
    setView("noticeWrite");
    // 에디터 내용 초기화는 Editor initialValue로 처리(아래에서 key로 리마운트)
  };

  const openNoticeDetail = (notice) => {
    setSelected(notice);
    setView("noticeDetail");
  };

  const openNoticeEdit = () => {
    if (!selected) return;
    setNoticeTitle(selected.title);
    setView("noticeEdit");
  };

  const submitNoticeWrite = () => {
    const ed = editorRef.current?.getInstance();
    const html = ed ? ed.getHTML() : "";

    if (!noticeTitle.trim()) return alert("제목을 입력해 주세요.");
    if (!html || html.trim() === "<p><br></p>")
      return alert("내용을 입력해 주세요.");

    const newId = (notices[0]?.id || 0) + 1;
    const today = "2025-12-22"; // 더미. 실제는 new Date()로.

    const newNotice = {
      id: newId,
      title: noticeTitle,
      content: html,
      date: today,
    };
    setNotices((prev) => [newNotice, ...prev]);

    setView("list");
    setSelected(null);
    setNoticeTitle("");
  };

  const submitNoticeEdit = () => {
    if (!selected) return;
    const ed = editorRef.current?.getInstance();
    const html = ed ? ed.getHTML() : "";

    if (!noticeTitle.trim()) return alert("제목을 입력해 주세요.");
    if (!html || html.trim() === "<p><br></p>")
      return alert("내용을 입력해 주세요.");

    setNotices((prev) =>
      prev.map((n) =>
        n.id === selected.id ? { ...n, title: noticeTitle, content: html } : n
      )
    );

    // selected도 최신으로 갱신
    setSelected((prev) =>
      prev ? { ...prev, title: noticeTitle, content: html } : prev
    );
    setView("noticeDetail");
  };

  const deleteNotice = () => {
    if (!selected) return;
    if (!window.confirm("공지사항을 삭제할까요?")) return;

    setNotices((prev) => prev.filter((n) => n.id !== selected.id));
    setSelected(null);
    setView("list");
  };

  /* =========================
     캘린더 렌더 (12월 31일 고정 더미)
  ========================= */

  const renderCalendar = () => {
    const year = 2025;
    const month = 12;

    return (
      <Calendar>
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          const dateKey = toDateKey(year, month, day);
          const events = calendar[dateKey] || [];

          return (
            <Day key={dateKey}>
              {day}
              {events.map((ev) => (
                <Event
                  key={`${ev.auctionId}-${dateKey}`}
                  title={`${ev.title} (${ev.time})`}
                  onClick={() => {
                    // 일정 클릭 → 상세/수정/취소 화면으로
                    const auction = auctions.find((a) => a.id === ev.auctionId);
                    if (!auction) return;

                    setSelected(auction);
                    setEditingInfo({
                      auctionId: ev.auctionId,
                      prevDateKey: dateKey,
                    });
                    setScheduleDate(dateKey);
                    setScheduleTime(ev.time || "");
                    setView("scheduleDetail");
                  }}
                >
                  {ev.title} ({ev.time})
                </Event>
              ))}
            </Day>
          );
        })}
      </Calendar>
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <Container>
      <h1>줍줍 관리자 페이지</h1>

      <Nav>
        {MENUS.map((m) => (
          <button
            key={m}
            className={menu === m ? "active" : ""}
            onClick={() => setMenu(m)}
          >
            {m}
          </button>
        ))}
      </Nav>

      {/* =========================
         1) 회원관리
      ========================= */}
      {menu === "회원관리" && (
        <>
          <TopActions>
            <div className="left" />
            <div className="right">
              <Button
                onClick={() => {
                  setMsgTarget({ id: null, nickname: "전체", isAll: true });
                  setIsMsgModalOpen(true);
                }}
                style={{ background: "#000", color: "#fff" }}
              >
                전체 쪽지 발송
              </Button>
            </div>
          </TopActions>
          <Table>
            <thead>
              <tr>
                <th>닉네임</th>
                <th>이메일</th>
                <th>상태</th>
                <th>확인</th>
                <th>쪽지</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.nickname}</td>
                  <td>{m.email}</td>
                  <td>
                    <select
                      value={m.pendingStatus}
                      onChange={(e) => {
                        const next = e.target.value;
                        setMembers((prev) =>
                          prev.map((u) =>
                            u.id === m.id ? { ...u, pendingStatus: next } : u
                          )
                        );
                      }}
                    >
                      <option value="정상">정상</option>
                      <option value="정지">정지</option>
                    </select>
                  </td>
                  <td>
                    <Button
                      onClick={async () => {
                        try {
                          const isActive = m.pendingStatus === "정상";

                          // ❗ 수정: memberUpdateStatus 대신 실제 AxiosApi 함수 사용
                          if (isActive) {
                            await AxiosApi.activateMember(m.id);
                          } else {
                            await AxiosApi.suspendMember(m.id);
                          }

                          alert(`${m.nickname}님의 상태가 변경되었습니다.`);
                          // 목록 새로고침 로직...
                        } catch (error) {
                          alert("상태 변경 실패");
                        }
                      }}
                    >
                      확인
                    </Button>
                  </td>
                  {/* ❗ 두 번째 '확인' 버튼은 여기서 삭제했습니다. */}
                  <td>
                    <Button
                      onClick={() => {
                        setMsgTarget({
                          id: m.id,
                          nickname: m.nickname,
                          isAll: false,
                        });
                        setIsMsgModalOpen(true);
                      }}
                    >
                      쪽지
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* =========================
         2) 대규모 경매 승인
         - list: 승인 대기/완료
         - scheduleForm: 일정 설정 후 확인으로 승인
      ========================= */}
      {menu === "대규모 경매 승인" && view === "list" && (
        <Table>
          <thead>
            <tr>
              <th>판매자</th>
              <th>제목</th>
              <th>상태</th>
              <th>일정</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((a) => (
              <tr key={a.id}>
                <td>{a.sellerId}</td>
                <td className="title">{a.itemName}</td>
                <td>
                  <Badge approved={a.auctionStatus}>대기</Badge>
                </td>
                <td>{formatScheduleLabel(a)}</td>
                <td>
                  <Button
                    disabled={
                      a.approved && a.schedule?.date && a.schedule?.time
                    }
                    onClick={() => {
                      setSelected(a);
                      setScheduleDate(a.schedule?.date || "");
                      setScheduleTime(a.schedule?.time || "");
                      setView("scheduleForm");
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

      {menu === "대규모 경매 승인" && view === "scheduleForm" && selected && (
        <FormBox>
          <h2>경매 일정 설정 (승인)</h2>
          <p style={{ fontFamily: "Noto Sans KR" }}>
            <b>{selected.itemName}</b> / 판매자: {selected.sellerId}
          </p>

          <TwoCol>
            <div>
              <Row>
                <label>날짜</label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </Row>
            </div>
            <div>
              <Row>
                <label>시간</label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </Row>
            </div>
          </TwoCol>

          <TopActions>
            <div className="left">
              <Button onClick={() => setView("list")}>취소</Button>
            </div>
            <div className="right">
              <Button onClick={confirmApproveWithSchedule}>확인(승인)</Button>
            </div>
          </TopActions>
        </FormBox>
      )}

      {/* =========================
         3) 대규모 일정 관리
         - list: 캘린더
         - scheduleDetail: 일정 클릭 후 상세(수정/취소)
         - scheduleEdit: 수정 폼(confirmUpdateSchedule)
      ========================= */}
      {menu === "대규모 일정 관리" && view === "list" && (
        <>
          <TopActions>
            <div className="left" style={{ fontFamily: "Noto Sans KR" }}>
              <b>2025년 12월</b> (더미 캘린더)
            </div>
          </TopActions>
          {renderCalendar()}
        </>
      )}

      {menu === "대규모 일정 관리" && view === "scheduleDetail" && selected && (
        <FormBox>
          <h2>등록된 경매 일정</h2>
          <p style={{ fontFamily: "Noto Sans KR" }}>
            <b>{selected.title}</b> / 판매자: {selected.seller}
          </p>
          <p style={{ fontFamily: "Noto Sans KR" }}>
            현재 일정: <b>{formatScheduleLabel(selected)}</b>
          </p>

          <TopActions>
            <div className="left">
              <Button onClick={() => setView("list")}>닫기</Button>
            </div>
            <div className="right">
              <Button
                onClick={() => {
                  // 수정 화면
                  const prevKey =
                    editingInfo?.prevDateKey || selected.schedule?.date;
                  setEditingInfo({
                    auctionId: selected.id,
                    prevDateKey: prevKey,
                  });
                  setView("scheduleEdit");
                }}
              >
                수정
              </Button>
              <DangerButton onClick={cancelSchedule}>
                취소(일정삭제)
              </DangerButton>
            </div>
          </TopActions>
        </FormBox>
      )}

      {menu === "대규모 일정 관리" && view === "scheduleEdit" && selected && (
        <FormBox>
          <h2>일정 수정</h2>
          <p style={{ fontFamily: "Noto Sans KR" }}>
            <b>{selected.title}</b>
          </p>

          <TwoCol>
            <div>
              <Row>
                <label>날짜</label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </Row>
            </div>
            <div>
              <Row>
                <label>시간</label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </Row>
            </div>
          </TwoCol>

          <TopActions>
            <div className="left">
              <Button onClick={() => setView("list")}>취소</Button>
            </div>
            <div className="right">
              <Button onClick={confirmUpdateSchedule}>확인</Button>
            </div>
          </TopActions>
        </FormBox>
      )}

      {/* =========================
         4) 공지 사항
         - list / noticeWrite / noticeDetail / noticeEdit
      ========================= */}
      {menu === "공지 사항" && view === "list" && (
        <>
          <TopActions>
            <div className="left" />
            <div className="right">
              <Button onClick={openNoticeWrite}>공지 작성</Button>
            </div>
          </TopActions>

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
                  <td className="title" onClick={() => openNoticeDetail(n)}>
                    {n.title}
                  </td>
                  <td>{n.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {menu === "공지 사항" &&
        (view === "noticeWrite" || view === "noticeEdit") && (
          <FormBox>
            <h2>
              {view === "noticeWrite" ? "공지사항 작성" : "공지사항 수정"}
            </h2>

            <Row>
              <label>제목</label>
              <Input
                placeholder="제목을 입력하세요"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
              />
            </Row>

            <div style={{ marginTop: 14 }}>
              <Editor
                key={view === "noticeEdit" ? `edit-${selected?.id}` : "write"}
                ref={editorRef}
                height="320px"
                initialValue={
                  view === "noticeEdit" ? selected?.content || "" : ""
                }
              />
            </div>

            <TopActions style={{ marginTop: 18 }}>
              <div className="left">
                <Button
                  onClick={() => {
                    setView("list");
                    setSelected(null);
                    setNoticeTitle("");
                  }}
                >
                  취소
                </Button>
              </div>
              <div className="right">
                <Button
                  onClick={
                    view === "noticeWrite"
                      ? submitNoticeWrite
                      : submitNoticeEdit
                  }
                >
                  확인
                </Button>
              </div>
            </TopActions>
          </FormBox>
        )}

      {menu === "공지 사항" && view === "noticeDetail" && selected && (
        <FormBox>
          <h2>{selected.title}</h2>
          <p style={{ fontFamily: "Noto Sans KR", color: "#666" }}>
            게시일: {selected.date}
          </p>

          <div
            style={{ fontFamily: "Noto Sans KR", lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: selected.content }}
          />

          <TopActions style={{ marginTop: 24 }}>
            <div className="left">
              <Button
                onClick={() => {
                  setView("list");
                  setSelected(null);
                }}
              >
                목록
              </Button>
            </div>
            <div className="right">
              <Button onClick={openNoticeEdit}>수정</Button>
              <DangerButton onClick={deleteNotice}>삭제</DangerButton>
            </div>
          </TopActions>
        </FormBox>
      )}
      {isMsgModalOpen && (
        <ModalOverlay onClick={() => setIsMsgModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>
              {msgTarget.isAll
                ? "📢 전체 쪽지 발송"
                : `✉️ ${msgTarget.nickname}님에게 쪽지`}
            </h3>
            <label style={{ fontSize: "12px" }}>제목</label>
            <Input
              placeholder="제목"
              value={msgForm.title}
              onChange={(e) =>
                setMsgForm({ ...msgForm, title: e.target.value })
              }
            />
            <label style={{ fontSize: "12px" }}>내용</label>
            <textarea
              style={{
                width: "100%",
                height: "150px",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                resize: "none",
                fontFamily: "Noto Sans KR",
              }}
              placeholder="내용을 입력하세요"
              value={msgForm.content}
              onChange={(e) =>
                setMsgForm({ ...msgForm, content: e.target.value })
              }
            />
            <TopActions style={{ marginTop: "20px" }}>
              <div className="left">
                <Button onClick={() => setIsMsgModalOpen(false)}>취소</Button>
              </div>
              <div className="right">
                <Button
                  style={{ background: "#000", color: "#fff" }}
                  onClick={handleSendMessage}
                >
                  발송
                </Button>
              </div>
            </TopActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AdminPage;
