import { useEffect, useState } from "rect";

export const useRemainingTime = (auction) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!auction) return;

    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);
    const extendedEndTime = auction.extendedEndTime
      ? new Date(auction.extendedEndTime)
      : null;

    let end;
    if (now < startTime) {
      end = startTime;
    } else {
      end = extendedEndTime || endTime;
    }

    if (!end) return;

    const updateRemaining = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000)); // 초 단위
      setRemaining(diff);
    };

    updateRemaining();

    const timer = setInterval(updateRemaining, 100);

    return () => {
      clearInterval(timer);
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      return (
        <>
          {hours}시 {minutes}분 {seconds}초
        </>
      );
    };
  }, [auction]);
};
