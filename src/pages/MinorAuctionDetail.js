import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState /*, useEffect */ } from "react";
import AxiosAPI from "../api/AxiosAPI"; // 🔥 붙여두기만 함

/* =====================
   Dummy Data (임시)
===================== */

const DUMMY_AUCTION = {
  title: "WHY? 책 20권 묶음",
  currentPrice: 40000,
  bidUnit: 1000,
  bidCount: 0,
  remainTime: "11:11:11",
  images: [
    "/images/minor1.jpg",
    "/images/minor2.jpg",
    "/images/minor3.jpg",
    "/images/minor4.jpg",
    "/images/minor5.jpg",
  ],
  description: `본 상품은 사용감이 매우 적고 전체적으로 깔끔한 상태를 유지하고 있습니다.
모든 20권이 완질이며 낙서 및 훼손은 발견되지 않았습니다.`,
  notice: `경매 특성상 단순 변심에 의한 환불은 불가합니다.
입찰 전 상품 설명을 반드시 확인해주세요.`,
};

/* =====================
   styled
===================== */

const Container = styled.div`
  max-width: 1100px;
  margin: 30px auto;
  padding: 0 16px;
`;

const Header = styled.h1`
  font-size: 26px;
  text-align: center;
  margin-bottom: 20px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/* ===== Image ===== */

const ImageWrap = styled.div``;

const MainImage = styled.img`
  width: 100%;
  height: 420px;
  object-fit: contain;
  border-radius: 16px;
  background: #f5f5f5;

  @media (max-width: 768px) {
    height: 260px;
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  margin-top: 20px;
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 16px;
  overflow: hidden;
`;

const Thumb = styled.img`
  width: 140px;
  height: 95px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  border: ${(props) => (props.active ? "2px solid #000" : "1px solid #ddd")};

  @media (max-width: 768px) {
    width: 120px;
    height: 90px;
  }
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 1;

  ${(props) => (props.left ? "left: -18px;" : "right: -18px;")}
`;

/* ===== Info ===== */

const InfoBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
`;

const Price = styled.div`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const InfoList = styled.ul`
  font-size: 14px;
  line-height: 2;
  margin-bottom: 20px;
`;

const BidRow = styled.div`
  display: flex;
  gap: 8px;
`;

const BidInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
`;

const BidButton = styled.button`
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: black;
  color: white;
  cursor: pointer;
`;

/* ===== Text Section ===== */

const Section = styled.section`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;

/* =====================
   Component
===================== */

const MinorAuctionDetail = () => {
  const { id } = useParams(); // 🔥 유지
  const auction = DUMMY_AUCTION;

  const [currentImg, setCurrentImg] = useState(0);
  const [bidPrice, setBidPrice] = useState("");

  /* =====================
      서버 연동 (주석)
  ===================== */

  /*
  useEffect(() => {
    const fetchAuction = async () => {
      const res = await AxiosAPI.get(`/auction/minor/${id}`);
      setAuction(res.data);
    };
    fetchAuction();
  }, [id]);
  */

  /*
  const handleBid = async () => {
    await AxiosAPI.post(`/auction/minor/${id}/bid`, {
      price: bidPrice,
    });
  };
  */

  /* =====================
     Front-only Logic
  ===================== */

  const prevImage = () => {
    setCurrentImg((prev) =>
      prev === 0 ? auction.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImg((prev) =>
      prev === auction.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBid = () => {
    if (bidPrice < auction.currentPrice + auction.bidUnit) {
      alert("입찰 금액이 부족합니다.");
      return;
    }
    alert("입찰 처리 (서버 연동 전)");
  };

  return (
    <Container>
      <Header>
        {auction.title} <span style={{ fontSize: 14 }}>#{id}</span>
      </Header>

      <MainGrid>
        {/* 이미지 */}
        <ImageWrap>
          <MainImage src={auction.images[currentImg]} />

          <SliderWrapper>
            <Arrow left onClick={prevImage}>
              ‹
            </Arrow>
            <Arrow onClick={nextImage}>›</Arrow>

            <ThumbRow>
              {auction.images.map((img, idx) => (
                <Thumb
                  key={idx}
                  src={img}
                  active={idx === currentImg}
                  onClick={() => setCurrentImg(idx)}
                />
              ))}
            </ThumbRow>
          </SliderWrapper>
        </ImageWrap>

        {/* 경매 정보 */}
        <InfoBox>
          <Price>현재가 {auction.currentPrice.toLocaleString()}원</Price>

          <InfoList>
            <li>남은 시간 : {auction.remainTime}</li>
            <li>입찰 횟수 : {auction.bidCount}회</li>
            <li>입찰 단위 : {auction.bidUnit.toLocaleString()}원</li>
            <li>즉시 구매 : 불가</li>
          </InfoList>

          <BidRow>
            <BidInput
              value={bidPrice}
              onChange={(e) => setBidPrice(Number(e.target.value))}
              placeholder="입찰금액 입력"
            />
            <BidButton onClick={handleBid}>입찰</BidButton>
          </BidRow>
        </InfoBox>
      </MainGrid>

      {/* 상품 설명 */}
      <Section>
        <SectionTitle>상품설명</SectionTitle>
        <p style={{ whiteSpace: "pre-line" }}>{auction.description}</p>
      </Section>

      {/* 주의 사항 */}
      <Section>
        <SectionTitle>주의 사항</SectionTitle>
        <p style={{ whiteSpace: "pre-line" }}>{auction.notice}</p>
      </Section>
    </Container>
  );
};

export default MinorAuctionDetail;
