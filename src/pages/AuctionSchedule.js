import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AxiosApi from "../api/AxiosAPI";

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
  grid-template-columns: 1fr 350px;
  gap: 30px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarCard = styled.div`
  background: white;
  border-radius: 25px;
  padding: 20px;
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
    /* 박스 사이즈 절대 고정 */
    height: 110px;
    border-top: 1px solid #f0f0f0;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden; /* 박스 밖으로 나가는 내용 숨김 */
    display: flex;
    flex-direction: column;

    &:hover {
      background: #f9f9f9;
    }
    &.today {
      background: #fff9eb;
    }
    &.selected {
      background: #f0f0f0;
      border: 2px solid #000;
      border-radius: 12px;
    }

    .date-num {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 4px;
    }
  }
`;

/* 텍스트 말줄임표(...) 처리 핵심 스타일 */
const EventTag = styled.div`
  background: #000;
  color: #fff;
  font-size: 11px; /* 너무 작지 않은 폰트 유지 */
  padding: 4px 8px;
  border-radius: 6px;
  margin-top: 4px;
  font-family: "dnf bitbit v2", sans-serif;

  /* 한 줄 말줄임 설정 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  width: 100%;
  box-sizing: border-box;
`;

const InfoCard = styled.div`
  background: #fff;
  border-radius: 25px;
  padding: 30px;
  border: 1px solid #eee;
  height: 600px; /* 높이 고정으로 통일감 부여 */
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;

  h3 {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }

  .event-list {
    flex: 1;
    overflow-y: auto; /* 내용 많아지면 스크롤 */
  }
`;

const AuctionItem = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 15px;

  .time {
    font-size: 12px;
    color: #ff4d4f;
    font-weight: bold;
  }
  .name {
    font-size: 16px;
    font-weight: bold;
    margin: 5px 0;
    /* 사이드바에서도 제목이 너무 길면 말줄임 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    border: none;
    background: #000;
    color: #fff;
    font-family: "dnf bitbit v2", sans-serif;
    cursor: pointer;
    &:hover {
      background: #333;
    }
  }
`;

/* =========================
    Component Logic
========================= */

const AuctionSchedule = () => {
  // const [selectedDate, setSelectedDate] = useState(18);

  // const events = {
  //   1: [
  //     {
  //       id: 101,
  //       title: "새해 첫 한정판 경매 대공개",
  //       seller: "ZubZub_KR",
  //       time: "14:00",
  //     },
  //   ],
  //   3: [
  //     {
  //       id: 102,
  //       title: "샤넬 팝업 초특가 경매 세일",
  //       seller: "Luxury_H",
  //       time: "18:00",
  //     },
  //   ],
  //   18: [
  //     {
  //       id: 104,
  //       title: "맥북 프로 M3 미개봉 풀박스",
  //       seller: "Tech_Master",
  //       time: "15:00",
  //     },
  //     {
  //       id: 105,
  //       title: "레트로 게임기 닌텐도 모음집",
  //       seller: "Retro_King",
  //       time: "21:00",
  //     },
  //   ],
  //   24: [
  //     {
  //       id: 106,
  //       title: "크리스마스 이브 특별 옥션 이벤트",
  //       seller: "Santa_Zub",
  //       time: "12:00",
  //     },
  //   ],
  // };

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(18);

  useEffect(() => {
    AxiosApi.getAuctionSchedule("/api/auction/schedule")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("스케쥴을 받아오지 못했습니다.", error);
      });
  }, []);

  return (
    <PageWrapper>
      <TitleSection>
        <h1>대규모 경매 일정</h1>
        <p>엄격한 심사를 통과한 프리미엄 경매 리스트입니다.</p>
      </TitleSection>

      <Layout>
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
                      <EventTag key={ev.id} title={ev.title}>
                        {ev.title}
                      </EventTag>
                    ))}
                </div>
              );
            })}
          </CalendarGrid>
        </CalendarCard>

        <InfoCard>
          <h3>12월 {selectedDate}일 경매</h3>
          <div className="event-list">
            {events[selectedDate] ? (
              events[selectedDate].map((ev) => (
                <AuctionItem key={ev.id}>
                  <div className="time">{ev.time} 시작 예정</div>
                  <div className="name">{ev.title}</div>
                  <div className="seller">판매자: {ev.seller}</div>
                  <button
                    onClick={() =>
                      alert(`${ev.title} 입찰 페이지로 이동합니다.`)
                    }
                  >
                    입장하기
                  </button>
                </AuctionItem>
              ))
            ) : (
              <div
                style={{
                  color: "#999",
                  textAlign: "center",
                  marginTop: "100px",
                }}
              >
                예정된 경매 일정이 없습니다.
              </div>
            )}
          </div>
        </InfoCard>
      </Layout>
    </PageWrapper>
  );
};

export default AuctionSchedule;
