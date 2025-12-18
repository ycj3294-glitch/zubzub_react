import React, { useState } from "react";
import styled from "styled-components";

/* =========================
    Styled Components
========================= */

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 50px 20px;
  font-family: "Noto Sans KR", sans-serif;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 50px;

  h1 {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 32px;
    margin-bottom: 10px;
  }
  p {
    color: #666;
    font-size: 16px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px; /* 왼쪽 달력, 오른쪽 상세정보 */
  gap: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* 캘린더 스타일 */
const CalendarCard = styled.div`
  background: white;
  border-radius: 25px;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  .day-label {
    text-align: center;
    padding: 15px 0;
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 14px;
    color: #888;
  }

  .date-cell {
    height: 100px;
    border-top: 1px solid #f0f0f0;
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s;
    position: relative;

    &:hover {
      background: #f9f9f9;
    }
    &.today {
      background: #fff9eb;
    }
    &.selected {
      background: #f0f0f0;
      border: 2px solid #000;
      border-radius: 10px;
    }

    .date-num {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 5px;
    }
  }
`;

/* 경매 이벤트 점(Dot) 또는 태그 */
const EventTag = styled.div`
  background: #000;
  color: #fff;
  font-size: 10px;
  padding: 4px 6px;
  border-radius: 6px;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "dnf bitbit v2", sans-serif;
`;

/* 오른쪽 사이드바: 선택한 날짜의 경매 정보 */
const InfoCard = styled.div`
  background: #fff;
  border-radius: 25px;
  padding: 30px;
  border: 1px solid #eee;
  height: fit-content;
  position: sticky;
  top: 20px;

  h3 {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }
`;

const AuctionItem = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  .time {
    font-size: 12px;
    color: #ff4d4f;
    font-weight: bold;
  }
  .name {
    font-size: 16px;
    font-weight: bold;
    margin: 5px 0;
  }
  .seller {
    font-size: 13px;
    color: #888;
  }

  button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    border: 1px solid #000;
    background: #fff;
    font-family: "dnf bitbit v2", sans-serif;
    cursor: pointer;
    &:hover {
      background: #000;
      color: #fff;
    }
  }
`;

/* =========================
    Component Logic
========================= */

const AuctionSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(18); // 기본값 오늘 날짜

  // 관리자 페이지에서 썼던 데이터와 유사한 유저용 더미데이터
  const events = {
    1: [
      {
        id: 101,
        title: "새해 첫 한정판 경매",
        seller: "ZubZub_KR",
        time: "14:00",
      },
    ],
    3: [
      { id: 102, title: "샤넬 팝업 경매", seller: "Luxury_H", time: "18:00" },
    ],
    7: [
      {
        id: 103,
        title: "나이키 오프화이트",
        seller: "SneakerHead",
        time: "20:00",
      },
    ],
    18: [
      {
        id: 104,
        title: "맥북 프로 M3 미개봉",
        seller: "Tech_Master",
        time: "15:00",
      },
      {
        id: 105,
        title: "레트로 게임기 모음",
        seller: "Retro_King",
        time: "21:00",
      },
    ],
    24: [
      { id: 106, title: "크리스마스 경매", seller: "Santa_Zub", time: "12:00" },
    ],
  };

  return (
    <PageWrapper>
      <TitleSection>
        <h1>대규모 경매 일정</h1>
        <p>줍줍이 보증하는 프리미엄 경매 일정을 확인하세요!</p>
      </TitleSection>

      <Layout>
        {/* 왼쪽: 달력 */}
        <CalendarCard>
          <CalendarGrid>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="day-label">
                {d}
              </div>
            ))}
            {[...Array(31)].map((_, i) => {
              const date = i + 1;
              return (
                <div
                  key={i}
                  className={`date-cell ${date === 18 ? "today" : ""} ${
                    selectedDate === date ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="date-num">{date}</div>
                  {events[date] &&
                    events[date].map((ev) => (
                      <EventTag key={ev.id}>{ev.title}</EventTag>
                    ))}
                </div>
              );
            })}
          </CalendarGrid>
        </CalendarCard>

        {/* 오른쪽: 상세 정보 */}
        <InfoCard>
          <h3>12월 {selectedDate}일 경매</h3>
          {events[selectedDate] ? (
            events[selectedDate].map((ev) => (
              <AuctionItem key={ev.id}>
                <div className="time">시작 시간 : {ev.time}</div>
                <div className="name">{ev.title}</div>
                <div className="seller">판매자: {ev.seller}</div>
                <button
                  onClick={() => alert(`${ev.title} 경매장으로 이동합니다!`)}
                >
                  입장하기
                </button>
              </AuctionItem>
            ))
          ) : (
            <div
              style={{ color: "#999", textAlign: "center", paddingTop: "20px" }}
            >
              해당 날짜에는 예정된
              <br />
              대규모 경매가 없습니다.
            </div>
          )}
        </InfoCard>
      </Layout>
    </PageWrapper>
  );
};

export default AuctionSchedule;
