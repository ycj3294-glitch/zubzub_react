import { useEffect, useState } from "react";

import styled from "styled-components";

const Box = styled.div`
  background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: "Inter", sans-serif;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const Value = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
`;

const TimerComponent = ({ end }) => {
  const [remaining, setRemaining] = useState(0);

  const updateRemaining = () => {
    const endTime = new Date(end).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((endTime - now) / 1000));
    setRemaining(diff);
  };

  useEffect(() => {
    if (!end) return;
    updateRemaining();

    const timer = setInterval(updateRemaining, 1000); // 1초마다 갱신
    return () => clearInterval(timer);
  }, [end]);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <Box>
      <Title>남은 시간</Title>
      <Value>
        {hours}시간 {minutes}분 {seconds}초
      </Value>
    </Box>
  );
};

export default TimerComponent;
