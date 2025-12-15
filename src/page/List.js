import { useState, useEffect } from "react";

const GetList = () => {
  const [list, setList] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetch(
      `http://localhost:8111/auction/selllist/1?page=${currentPage}&size=10`
    )
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 오류");
        return res.json();
      })
      .then((data) => {
        setList(data.content);
        setTotalPages(data.totalPages);
      })

      .catch((err) => console.error(err));
  }, [currentPage]);

  if (!list) return <div>로딩 중...</div>;

  return (
    <div>
      <p>뭐라도 좀 떠라</p>
      <ul>
        {list.map((item) => (
          <li key={item.id}>
            경매 물품:{item.itemName}, 시작가:{item.startPrice}, 낙찰가:
            {item.finalPrice}, 종료: {item.endTime}, 낙찰자: {item.winnerId}
          </li>
        ))}
      </ul>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GetList;
