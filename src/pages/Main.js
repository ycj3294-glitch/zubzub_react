import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* =========================
   styled
========================= */

const Container = styled.div`
  width: 100%;
`;

const Section = styled.section`
  max-width: 1100px;
  margin: 60px auto;
  padding: 0 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

/* --- 메인 배너 --- */
const Hero = styled.div`
  width: 1100px;
  height: 700px;
  margin: 40px auto;
  border-radius: 20px;
  background-image: url("/images/mainpic1.svg");
  background-size: cover;
  background-position: center;
`;

// 하단 배너
const Billan = styled.div`
  width: 1100px;
  height: 700px;
  margin: 40px auto;
  border-radius: 20px;
  background-image: url("/images/mainpic2.svg");
  background-size: cover;
  background-position: center;
`;

/* --- 대규모 경매 --- */
const MajorGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
`;

const MajorCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
`;

/* --- 소규모 경매 --- */
const MinorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
`;

const MinorCard = styled.div`
  cursor: pointer;
  text-align: center;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    display: block;
  }

  p {
    margin-top: 6px;
    font-size: 14px;
  }
`;

/* =========================
   Component
========================= */

const Main = () => {
  const nav = useNavigate();

  // 임시 데이터
  const minorList = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    img: `/images/minor${(i % 5) + 1}.jpg`,
  }));

  return (
    <Container>
      {/* 메인 배너 */}
      <Hero />

      {/* 대규모 경매 */}
      <Section>
        <Title>대규모 경매</Title>

        <MajorGrid>
          <MajorCard onClick={() => nav("/auction/major/1")}>
            <h3>타이머</h3>
            <p>실시간 진행 중</p>
          </MajorCard>

          <MajorCard onClick={() => nav("/auction/major/1")}>
            <h3>현재 입찰가</h3>
            <p>판매자 / 구매자 실시간 질문</p>
          </MajorCard>

          <MajorCard onClick={() => nav("/auction/major/1")}>
            <h3>경매 일정</h3>
            <p>12월 13일 ~ 18일</p>
          </MajorCard>
        </MajorGrid>
      </Section>

      {/* 소규모 경매 */}
      <Section>
        <Title>소규모 경매</Title>

        <MinorGrid>
          {minorList.map((item) => (
            <MinorCard
              key={item.id}
              onClick={() => nav(`/auction/minor/${item.id}`)}
            >
              <img src={item.img} alt="auction" />
              <p>최소 입찰가</p>
            </MinorCard>
          ))}
        </MinorGrid>
      </Section>
      {/* 하단 사진 */}
      <Billan />
    </Container>
  );
};

export default Main;
