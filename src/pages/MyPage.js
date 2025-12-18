import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* =====================
    styled
===================== */
const Container = styled.div`
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: "Noto Sans KR", sans-serif;
`;

const ProfileSection = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 30px;
  padding: 40px;
  display: flex;
  gap: 40px;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImgWrap = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  cursor: pointer;
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f8f8f8;
`;

const EditBadge = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #000;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 3px solid #fff;
`;

const InfoBox = styled.div`
  flex: 1;
`;

const Nickname = styled.h2`
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 26px;
  margin-bottom: 15px;
  span {
    font-size: 14px;
    color: #999;
    font-family: "Noto Sans KR";
    margin-left: 8px;
  }
`;

const CoinRow = styled.div`
  background: #f9f9f9;
  padding: 15px 20px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .label {
    font-weight: 700;
    color: #666;
  }
  .value {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 18px;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  background: ${(props) => (props.black ? "#000" : "#eee")};
  color: ${(props) => (props.black ? "#fff" : "#333")};
  transition: 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

const Section = styled.div`
  margin-top: 50px;
  h3 {
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const List = styled.div`
  border-top: 2px solid #000;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #eee;
  .title {
    font-weight: 600;
  }
  .date {
    color: #bbb;
    font-size: 13px;
  }
`;

/* =====================
    Component
===================== */
const MyPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ProfileSection>
        <ProfileImgWrap onClick={() => navigate("/edit-profile")}>
          <ProfileImg src="https://via.placeholder.com/150" />
          <EditBadge>✎</EditBadge>
        </ProfileImgWrap>

        <InfoBox>
          <Nickname>
            LeeTS <span>이태수님</span>
          </Nickname>
          <CoinRow>
            <span className="label">보유 줍코인</span>
            <span className="value">100,000 ZC</span>
          </CoinRow>
          <BtnGroup>
            <Button onClick={() => navigate("/edit-profile")}>
              회원정보 수정
            </Button>
            <Button black onClick={() => alert("충전 팝업")}>
              코인 충전
            </Button>
          </BtnGroup>
        </InfoBox>
      </ProfileSection>

      <Section>
        <h3>최근 구매 내역</h3>
        <List>
          <ListItem>
            <span className="title">상태 좋은 중고 자전거</span>
            <span className="date">2025.12.18</span>
          </ListItem>
          <ListItem>
            <span className="title">레트로 게임기 모음</span>
            <span className="date">2025.12.15</span>
          </ListItem>
        </List>
      </Section>
    </Container>
  );
};

export default MyPage;
