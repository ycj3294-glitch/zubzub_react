import { useEffect, useState } from "react";

import styled from "styled-components";

const TimerComponent = ({ end }) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const updateRemaining = () => {
      const endTime = new Date(end).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemaining(diff);
    };

    if (!end) return;
    updateRemaining();

    const timer = setInterval(updateRemaining, 1000); // 1초마다 갱신
    return () => clearInterval(timer);
  }, [end]);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <div>
      {hours}시간 {minutes}분 {seconds}초
    </div>
  );
};

export default TimerComponent;
