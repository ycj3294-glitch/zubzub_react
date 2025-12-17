import { useState, useEffect } from "react";

const GetList = () => {
  const [list, setList] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8111/auction/selllist/1")
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 오류");
        return res.json();
      })
      .then((data) => setList(data))
      .catch((err) => console.error(err));
  }, []);

  if (!list) return <div>로딩 중...</div>;

  return (
    <div>
      {list.map((item) => (
        <p key={item.id}>
          경매 물품: {item.itemName}, 시작가: {item.startPrice}, 낙찰가:{" "}
          {item.finalPrice}, 시작 시간: {item.startTime}, 종료 시간:{" "}
          {item.endTime}
        </p>
      ))}
    </div>
  );
};

export default GetList;
