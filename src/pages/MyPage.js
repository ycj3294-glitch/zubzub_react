import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ChargeModal from "../components/common/ChargeModal";
import { useNavigate } from "react-router-dom";

/* =====================
   Dummy Data
===================== */

const USER = {
  email: "55029564@gmail.com",
  name: "이태수",
  nickname: "LeeTS",
  coin: 100000,
};

const HISTORY = Array.from({ length: 5 }, () => ({
  title: "WHY? 책 상태 A급 20권 묶음 판매",
  date: "25.12.15 - 17:03:42",
}));

/* =====================
   styled
===================== */

const Container = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 20px;
`;

const ProfileRow = styled.div`
  display: flex;
  gap: 48px;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const ProfileImgWrap = styled.div`
  position: relative;
`;

const ProfileImg = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
`;

const EditIcon = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  border-radius: 50%;
  border: none;
  padding: 6px;
  cursor: pointer;
`;

const InfoBox = styled.div`
  flex: 0 0 520px;
  max-width: 520px;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
`;

const CoinRow = styled(InfoRow)`
  gap: 8px;
`;

const CoinValue = styled.span`
  font-weight: bold;
`;

const ChargeBtn = styled.button`
  margin-left: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  border: none;
  background: #555;
  color: white;
  font-size: 12px;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 6px 14px;
  border-radius: 12px;
  border: none;
  background: #555;
  color: white;
  cursor: pointer;
`;

const EditBtn = styled(Button)`
  margin-top: 10px;
  background: #888;
`;

const Divider = styled.hr`
  margin: 40px 0;
  border: none;
  border-top: 1px solid #ddd;
`;

/* ===== History ===== */

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
`;

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const MoreBtn = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  font-size: 13px;
`;

/* =====================
   Component
===================== */

const MyPage = () => {
  const { isLogin, user } = useAuth();
  const [showCharge, setShowCharge] = useState(false);
  const nav = useNavigate();

  return (
    <Container>
      {/* 프로필 */}
      <ProfileRow>
        <ProfileImgWrap>
          <ProfileImg src="/images/profile.jpg" />
        </ProfileImgWrap>

        <InfoBox>
          <InfoRow>
            {console.log(user)}
            <strong>이메일</strong>
            <span>{user && user.email}</span>
          </InfoRow>
          <InfoRow>
            <strong>이름</strong>
            <span>{user && user.name}</span>
          </InfoRow>
          <InfoRow>
            <strong>닉네임</strong>
            <span>{user && user.nickname}</span>
          </InfoRow>
          <InfoRow>
            <strong>보유 줍코인</strong>
            <div>
              <CoinValue>{USER.coin.toLocaleString()} 줍코인</CoinValue>
              <ChargeBtn onClick={() => setShowCharge(true)}>충전</ChargeBtn>

              {showCharge && (
                <ChargeModal onClose={() => setShowCharge(false)} />
              )}
            </div>
          </InfoRow>

          <EditBtn onClick={() => nav("/mypage-edit")}>개인정보 수정</EditBtn>
        </InfoBox>
      </ProfileRow>

      <Divider />

      {/* 구매내역 */}
      <Section>
        <SectionTitle>구매내역</SectionTitle>
        {HISTORY.map((item, idx) => (
          <HistoryRow key={idx}>
            <span>{item.title}</span>
            <span>{item.date}</span>
          </HistoryRow>
        ))}
        {/* ✅ 버튼 수정: AuctionHistory 페이지로 이동 */}
        <MoreBtn onClick={() => nav("/auction-history")}>
          나의 경매 기록 보기
        </MoreBtn>
      </Section>

      {/* 판매내역 */}
      <Section>
        <SectionTitle>판매내역</SectionTitle>
        {HISTORY.map((item, idx) => (
          <HistoryRow key={idx}>
            <span>{item.title}</span>
            <span>{item.date}</span>
          </HistoryRow>
        ))}
        {/* ✅ 버튼 수정: AuctionHistory 페이지로 이동 */}
        <MoreBtn onClick={() => nav("/auction-history")}>
          나의 경매 기록 보기
        </MoreBtn>
      </Section>
    </Container>
  );
};

export default MyPage;
