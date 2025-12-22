const MySales = () => {
  return (
    <div>
      <h2>내 판매 기록</h2>
      {[...Array(10)].map((_, i) => (
        <div key={i}>
          <span>상품명 {i + 1}</span>
          <span>낙찰 완료</span>
        </div>
      ))}
    </div>
  );
};

export default MySales;
