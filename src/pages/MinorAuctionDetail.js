import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AxiosAPI from "../api/AxiosAPI";
import { jwtDecode } from "jwt-decode";

/* =====================
   Styled Components
===================== */

const Container = styled.div`
  max-width: 1100px;
  margin: 50px auto;
  padding: 0 16px;
`;

const Header = styled.h1`
  font-size: 28px;
  font-weight: 900;
  text-align: left;
  margin-bottom: 30px;
  border-bottom: 2px solid #000;
  padding-bottom: 15px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 30px;
  /* 중요: 양쪽 박스 높이를 강제로 맞춤 */
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ===== Image Section ===== */

const ImageWrap = styled.div`
  width: 100%;
  /* 높이를 부모(Grid)에 맞추고 내부 요소 배치 설정 */
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  /* 고정 높이 대신 최소 높이 설정 + 남는 공간 채우기(flex: 1) */
  min-height: 500px;
  flex: 1;
  background: #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  z-index: 2;
  transition: 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  ${(props) => (props.left ? "left: 10px;" : "right: 10px;")}
`;

const SliderWrapper = styled.div`
  margin-top: 15px;
  width: 100%;
  /* 썸네일 영역은 높이 고정 (필요시) */
  flex-shrink: 0;
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
`;

const Thumb = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: ${(props) => (props.active ? "3px solid #000" : "1px solid #ddd")};
  opacity: ${(props) => (props.active ? "1" : "0.5")};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    border-color: #666;
  }
`;

/* ===== Info Section ===== */

const InfoBox = styled.div`
  border: 1px solid #000;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  /* 중요: 왼쪽 이미지 박스와 높이를 맞추기 위해 100% 설정 */
  height: 100%;
  box-sizing: border-box;
`;

const Price = styled.div`
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: 900;
  color: #d32f2f;

  span.badge {
    background: #000;
    color: #fff;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    margin-left: 10px;
    vertical-align: middle;
    font-weight: normal;
  }
`;

const BlindText = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: "🔒";
    font-size: 12px;
  }
`;

const InfoList = styled.ul`
  border-top: 1px dashed #ccc;
  padding-top: 20px;
  margin-bottom: 25px;
  list-style: none;
  padding-left: 0;

  li {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 12px;
    color: #444;
  }
`;

const BidRow = styled.div`
  margin-top: auto; /* 박스 하단으로 밀어내기 */
  display: flex;
  flex-direction: column;
`;

const BidInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 10px;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: #000;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const BidButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #333;
  }
`;

/* ===== Text Section ===== */

const Section = styled.section`
  margin-top: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 20px;
  border-left: 5px solid #000;
  padding-left: 15px;
`;

const DescriptionText = styled.div`
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  padding: 20px;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 8px;
  white-space: pre-line;
`;

/* =====================
   Component Logic
===================== */

const MinorAuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const [bidPrice, setBidPrice] = useState("");
  const [userCredit, setUserCredit] = useState(150000);
  const [myLastBid, setMyLastBid] = useState(0);

  // 사용자 정보 (토큰에서 디코딩)
  const token = localStorage.getItem("accessToken");
  const decoded = jwtDecode(token);
  const userId = decoded.memberId; // 실제 서버에서 사용하는 키 확인 필요

  useEffect(() => {
    if (userId && auction) {
      AxiosAPI.getUserInfo(userId).then((res) => {
        if (res?.data) setUserCredit(res.data.credit);
      });
    }
  }, [userId, auction]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await AxiosAPI.getAuction(id);
        setAuction(res.data);
      } catch (e) {
        console.error("데이터 로딩 실패", e);
      }
    };
    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (!auction?.endTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;
      setRemainingTime(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [auction?.endTime]);

  const formatTime = (ms) => {
    if (ms <= 0) return "경매 종료";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

  const nextImage = () => {
    if (!auction?.itemImgs) return;
    setCurrentImgIdx((prev) => (prev + 1) % auction.itemImgs.length);
  };

  const prevImage = () => {
    if (!auction?.itemImgs) return;
    setCurrentImgIdx(
      (prev) => (prev - 1 + auction.itemImgs.length) % auction.itemImgs.length
    );
  };

  const handleBid = async () => {
    if (bidPrice === "" || bidPrice <= 0) {
      alert("금액을 입력해주세요.");
      return;
    }
    const numericBid = Number(bidPrice);

    if (numericBid > userCredit) {
      alert("보유하신 ZC가 부족합니다.");
      return;
    }
    if (auction.auctionStatus === "COMPLETED") {
      alert("이미 종료된 경매입니다.");
      return;
    }
    if (numericBid < auction.startPrice) {
      alert(`최소 시작 금액은 ${auction.startPrice.toLocaleString()}원입니다.`);
      return;
    }

    if ((numericBid - auction.startPrice) % auction.minBidUnit !== 0) {
      alert(
        `입찰 단위(${auction.minBidUnit.toLocaleString()}원)에 맞춰서 입력해주세요.`
      );
      return;
    }
    try {
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const confirmMsg = `${numericBid.toLocaleString()}원으로 입찰하시겠습니까?\n(낙찰 시 취소 불가)`;
      if (!window.confirm(confirmMsg)) return;

      const response = await AxiosAPI.createBid(id, {
        bidderId: userId,
        price: numericBid,
      });

      if (response) {
        // ✅ 성공 시에만 상태 변경과 메시지
        alert(
          `${numericBid.toLocaleString()} ZC로 입찰 신청이 완료되었습니다!`
        );
        setMyLastBid(numericBid);
        setBidPrice("");
      }
    } catch (error) {
      console.error(error);
      alert("입찰 중 오류가 발생했습니다.");
    }
  };

  if (!auction) return <Container>로딩 중...</Container>;

  // 이미지가 1개인지 여부 확인 (null 체크 포함)
  const images =
    auction.itemImgs && auction.itemImgs.length > 0
      ? auction.itemImgs
      : [auction.itemImg];

  // 이미지가 2장 이상인지 확인하는 플래그
  const hasMultipleImages = images.length > 1;

  return (
    <Container>
      <Header>
        {auction.itemName}{" "}
        <span
          style={{
            fontSize: 14,
            fontWeight: "normal",
            color: "#888",
            display: "block",
            marginTop: "5px",
          }}
        >
          No.{id} 일반경매
        </span>
      </Header>

      <MainGrid>
        {/* 이미지 섹션 */}
        <ImageWrap>
          <MainImageContainer>
            <MainImage src={images[currentImgIdx]} alt="Main Product" />

            {/* 이미지가 2장 이상일 때만 화살표 노출 */}
            {hasMultipleImages && (
              <>
                <Arrow left onClick={prevImage}>
                  &lt;
                </Arrow>
                <Arrow onClick={nextImage}>&gt;</Arrow>
              </>
            )}
          </MainImageContainer>

          {/* 이미지가 2장 이상일 때만 썸네일 노출 */}
          {hasMultipleImages && (
            <SliderWrapper>
              <ThumbRow>
                {images.map((img, idx) => (
                  <Thumb
                    key={idx}
                    src={img}
                    active={idx === currentImgIdx}
                    onClick={() => setCurrentImgIdx(idx)}
                    alt={`thumbnail-${idx}`}
                  />
                ))}
              </ThumbRow>
            </SliderWrapper>
          )}
        </ImageWrap>

        {/* 정보 섹션 */}
        <InfoBox>
          <Price>시작가 {auction.startPrice?.toLocaleString()}원</Price>
          <BlindText> 블라인드 경매 진행중</BlindText>
          <InfoList>
            <li>
              <span>판매자</span>
              <strong>{auction.sellerNickname || "익명"}</strong>
            </li>
            <li>
              <span>남은 시간</span>
              <strong style={{ color: "#d32f2f" }}>
                {formatTime(remainingTime)}
              </strong>
            </li>
            <li>
              <span>입찰 단위</span>
              <strong>{auction.minBidUnit?.toLocaleString()}원</strong>
            </li>
            <li>
              <span>총 입찰</span>
              <strong>{auction.bidCount || 0}회</strong>
            </li>
            <li>
              <span>내 보유 포인트</span>
              <strong>{userCredit.toLocaleString()} ZC</strong>
            </li>
            <li>
              <span>나의 입찰가</span>
              <strong style={{ color: "#0066ff" }}>
                {myLastBid > 0 ? `${myLastBid.toLocaleString()} 원` : "-"}
              </strong>
            </li>
          </InfoList>

          <BidRow>
            <BidInput
              type="number"
              placeholder="입찰할 금액 입력"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
            />
            <BidButton onClick={handleBid}>입찰</BidButton>
          </BidRow>
        </InfoBox>
      </MainGrid>

      {/* 상품 설명 */}
      <Section>
        <SectionTitle>상품설명</SectionTitle>
        <DescriptionText>
          {auction.itemDesc || "등록된 상품 설명이 없습니다."}
        </DescriptionText>
      </Section>

      {/* 주의 사항 */}
      <Section>
        <SectionTitle>주의 사항</SectionTitle>
        <DescriptionText>
          <strong>○ 소규모 경매 진행 방식 안내 (블라인드 입찰)</strong>
          <br />
          소규모 경매는 블라인드 입찰 방식으로 진행됩니다.
          <br />
          입찰 금액은 본인에게만 공개되며 다른 참가자의 금액은 알 수 없습니다.
          <br />
          <br />
          <strong>○ 낙찰 기준</strong>
          <br />
          제한 시간 내 가장 높은 금액을 제시한 참가자가 낙찰됩니다.
          <br />
          동일 금액일 경우 먼저 입찰한 참가자가 우선합니다.
          <br />
          <br />
          <strong>⚠ 주의사항</strong>
          <br />
          입찰 후 취소 및 변경은 불가능합니다. 단순 변심에 의한 환불은 불가하니
          입찰 전 상품 설명을 반드시 확인해주세요.
        </DescriptionText>
      </Section>
    </Container>
  );
};

export default MinorAuctionDetail;
