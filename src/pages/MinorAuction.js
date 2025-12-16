import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/* =========================
   styled
========================= */

const Container = styled.div`
  width: 100%;
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
  margin-bottom: 32px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h2`
  font-size: 24px;
`;

const SearchArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`;

const SearchBox = styled.input`
  width: 100%;
  max-width: 360px;
  height: 40px;
  padding: 0 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
`;

const CategorySelect = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

/* --- grid --- */

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
  margin-top: 10px;
  font-size: 13px;
`;

const Name = styled.div`
  font-weight: 500;
  margin-bottom: 6px;
`;

const Price = styled.div`
  font-weight: 700;
`;

const SubInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #777;
  font-size: 12px;
  margin-top: 4px;
`;

/* --- pagination --- */

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 40px 0 20px;
  flex-wrap: wrap;
`;

const PageBtn = styled.button`
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: ${({ active }) => (active ? "#111" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#111")};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/* =========================
   Component
========================= */

const ITEMS_PER_PAGE = 12;

const MinorAuction = () => {
  const nav = useNavigate();

  /* --- state --- */
  const [currentPage, setCurrentPage] = useState(1);

  /* --- dummy data (API로 교체 예정) --- */
  const list = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    name: "물품 이름",
    price: "₩ 12,000",
    bidCount: 3,
    remain: "2일",
    img: `/images/minor${(i % 5) + 1}.jpg`,
  }));

  /* --- pagination calc --- */
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const pagedList = list.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* --- page change scroll --- */
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
            <SearchBox placeholder="검색어를 입력하세요" />
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
          {pagedList.map((item) => (
            <Card
              key={item.id}
              onClick={() => nav(`/auction/minor/${item.id}`)}
            >
              <ImageWrap>
                <Image src={item.img} alt={item.name} />
              </ImageWrap>

              <Info>
                <Name>{item.name}</Name>
                <Price>현재 입찰가 {item.price}</Price>
                <SubInfo>
                  <span>입찰 {item.bidCount}회</span>
                  <span>남은 기간 {item.remain}</span>
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
