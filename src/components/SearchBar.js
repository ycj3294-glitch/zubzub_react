import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const InputStyle = styled.input`
  width: 450px;
`;

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const onSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    setKeyword("");
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <InputStyle
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        placeholder="경매 상품 검색"
        style={{ padding: "6px 10px" }}
      />
      <button onClick={onSearch}>🔍</button>
    </div>
  );
};

export default SearchBar;
