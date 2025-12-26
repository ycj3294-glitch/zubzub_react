import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosAPI";

/* =====================
    Styled Components
===================== */

const Container = styled.div`
  max-width: 1100px;
  margin: 50px auto;
  padding: 0 16px;
`;

const Header = styled.h1`
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 30px;
  border-bottom: 2px solid #000;
  padding-bottom: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  transition: 0.25s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
`;

const ImageWrap = styled.div`
  width: 100%;
  height: 180px;
  background: #f9f9f9;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #d32f2f;
  margin-bottom: 6px;
`;

const Meta = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  justify-content: space-between;
`;

const BlindBadge = styled.span`
  display: inline-block;
  margin-left: 6px;
  background: #000;
  color: #fff;
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 4px;
`;

/* =====================
    Component Main
===================== */

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [auctions, setAuctions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!keyword) return;

    const fetchSearch = async () => {
      try {
        const res = await AxiosApi.searchAuctions(keyword, page);
        setAuctions(res.content);
        setTotalPages(res.totalPages);
      } catch (e) {
        console.error("검색 실패", e);
      }
    };

    fetchSearch();
  }, [keyword, page]);

  return (
    <Container>
      <Header>🔍 "{keyword}" 검색 결과</Header>

      {auctions.length === 0 && <p>검색 결과가 없습니다.</p>}

      <Grid>
        {auctions.map((a) => (
          <Card key={a.id} onClick={() => navigate(`/auction/minor/${a.id}`)}>
            <ImageWrap>
              <Image src={a.itemImg} alt={a.itemName} />
            </ImageWrap>

            <CardBody>
              <Title>{a.itemName}</Title>

              <Price>{a.startPrice.toLocaleString()} 원</Price>

              <Meta>
                <span>{a.sellerNickName || "익명"}</span>
                <span>{a.bidCount || 0}회 입찰</span>
              </Meta>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* 페이지네이션 */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            style={{
              margin: "0 6px",
              fontWeight: page === i ? "bold" : "normal",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </Container>
  );
};

export default SearchResult;
