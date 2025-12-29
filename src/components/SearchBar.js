import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

/* =====================
   Styled Components
===================== */

// 전체를 감싸는 컨테이너가 마치 하나의 입력창처럼 보이게 스타일링
const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px; /* 최대 너비 설정 */
  margin: 0 auto; /* 가운데 정렬 */
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff; /* 흰색 배경 */
  overflow: hidden; /* 내부 요소가 둥근 모서리를 넘지 않게 */
  transition: border-color 0.2s;

  /* 내부의 Input에 포커스가 가면 컨테이너 테두리 색 변경 */
  &:focus-within {
    border-color: #000;
  }
`;

// 내부 입력창: 테두리를 없애고 투명하게 만듦
const StyledInput = styled.input`
  flex: 1; /* 남은 공간 모두 차지 */
  padding: 12px 15px;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;

  &::placeholder {
    color: #999;
  }
`;

// 검색 버튼: 배경을 투명하게 하고 아이콘을 어둡게 변경, 왼쪽에 구분선 추가
const SearchBtn = styled.button`
  background: transparent;
  color: #333; /* 어두운 색 아이콘 */
  border: none;
  border-left: 1px solid #eee; /* 입력창과 구분되는 연한 선 */
  width: 50px;
  height: 48px; /* 컨테이너 높이에 맞춤 */
  cursor: pointer;
  font-size: 20px; /* 아이콘 크기 약간 키움 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;

  /* 마우스 올렸을 때 살짝 회색 배경 */
  &:hover {
    background: #f9f9f9;
  }
`;

/* =====================
   Component Logic (기존 유지)
===================== */

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const onSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    setKeyword("");
  };

  return (
    /* 기존 SearchWrapper 대신 스타일이 적용된 SearchContainer 사용 */
    <SearchContainer>
      <StyledInput
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        placeholder="경매 상품 검색"
      />
      <SearchBtn onClick={onSearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </SearchBtn>
    </SearchContainer>
  );
};

export default SearchBar;
