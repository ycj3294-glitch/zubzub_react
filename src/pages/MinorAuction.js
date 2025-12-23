import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosAPI";

/* =========================
    styled
========================= */

const Container = styled.div`
  width: 100%;
  background-color: #fff; /* 배경 화이트로 통일 */
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 60px auto;
  padding: 0 16px;
`;

/* --- header --- */

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 26px;
  font-family: "dnf bitbit v2", sans-serif; /* 폰트 통일 */
  color: #111;
  white-space: nowrap;
`;

/* ✅ 관리자 페이지와 통일된 검색바 스타일 */
const SearchArea = styled.div`
  display: flex;
  align-items: center;
  background: #f8f8f8;
  padding: 10px 18px;
  border-radius: 30px;
  border: 1px solid #eee;
  flex: 1;
  max-width: 450px;
  transition: 0.2s;

  &:focus-within {
    background: #fff;
    border-color: #000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  svg {
    color: #999;
    margin-right: 12px;
    flex-shrink: 0;
  }

  input {
    border: none;
    background: none;
    outline: none;
    font-size: 14px;
    font-family: "Noto Sans KR", sans-serif;
    width: 100%;
    color: #333;

    &::placeholder {
      color: #bbb;
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const CategorySelect = styled.select`
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #eee;
  background-color: #fff;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: #ccc;
  }
`;

/* --- grid (기존 유지) --- */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  cursor: pointer;
  &:hover img {
    transform: scale(1.05);
  }
`;

const ImageWrap = styled.div`
  overflow: hidden;
  border-radius: 16px;
  background-color: #f0f0f0;
`;

const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    height: 160px;
  }
`;

const Info = styled.div`
  margin-top: 12px;
  font-family: "Noto Sans KR", sans-serif;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 6px;
  color: #111;
`;

const Price = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #000;
`;

const SubInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 12px;
  margin-top: 6px;
`;

/* --- pagination --- */

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 60px 0 20px;
`;

const PageBtn = styled.button`
  min-width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: ${({ active }) => (active ? "#111" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#111")};
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background: ${({ active }) => (active ? "#111" : "#f8f8f8")};
    border-color: #ccc;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ITEMS_PER_PAGE = 12;

const calculateRemaining = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now; // ms 단위 차이

  if (diff <= 0) return "마감";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) return `${days}일 ${hours}시간`;
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
};

const MinorAuction = () => {
  const nav = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // const list = Array.from({ length: 32 }, (_, i) => ({
  //   id: i + 1,
  //   name: `소규모 경매 물품 ${i + 1}`,
  //   price: `₩ ${(12000 + i * 1000).toLocaleString()}`,
  //   bidCount: Math.floor(Math.random() * 10),
  //   remain: "2일",
  //   img: `https://via.placeholder.com/300x220?text=Item+${i + 1}`,
  // }));

  // const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  // const pagedList = list.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

  useEffect(() => {
    AxiosApi.get(`/api/auctions/minorlist`, {
      params: { page: currentPage - 1, size },
    })
      .then((res) => {
        setAuctions(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [currentPage, size]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <Container>
      <Inner>
        {/* header */}
        <HeaderRow>
          <Title>소규모 경매</Title>

          <SearchArea>
            {/* 돋보기 아이콘 추가 */}
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              placeholder="관심 있는 물품을 검색해 보세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchArea>

          <CategorySelect>
            <option value="all">전체보기</option>
            <option value="clothes">의류</option>
            <option value="electronics">전자기기</option>
            <option value="etc">잡화</option>
          </CategorySelect>
        </HeaderRow>

        {/* grid */}
        <Grid>
          {auctions.map((item) => (
            <Card
              key={item.id}
              onClick={() => nav(`/auction/minor/${item.id}`)}
            >
              <ImageWrap>
                <Image src={item.itemImg} alt={item.name} />
              </ImageWrap>

              <Info>
                <Name>{item.itemName}</Name>
                <Price>시작가 : {item.startPrice.toLocaleString()}원</Price>
                <SubInfo>
                  <span>입찰 {item.bidCount}회</span>
                  <span>남은 기간 {calculateRemaining(item.endTime)}</span>
                </SubInfo>
              </Info>
            </Card>
          ))}
        </Grid>

        {/* pagination */}
        <Pagination>
          <PageBtn
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ‹
          </PageBtn>

          {Array.from({ length: totalPages }, (_, i) => (
            <PageBtn
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageBtn>
          ))}

          <PageBtn
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            ›
          </PageBtn>
        </Pagination>
      </Inner>
    </Container>
  );
};

export default MinorAuction;
