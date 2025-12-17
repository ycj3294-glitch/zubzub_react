// Notice.js (공지사항 페이지 - 읽기 전용)

import styled from "styled-components";
import React from "react";

/* =========================
   Styled Components (공지사항 이미지 디자인 반영)
========================= */

const Container = styled.div`
  max-width: 900px;
  margin: 50px auto;
  padding: 0 16px;
  text-align: center;
`;

const ContentBox = styled.div`
  border: 1px solid #000;
  padding: 40px;
  text-align: left;
  background: white;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TitleBar = styled.h1`
  font-size: 28px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 3px solid #000;
  color: #000;
`;

const ContentSection = styled.div`
  margin-bottom: 30px;
  line-height: 1.8;
  font-size: 14px;
  color: #333;

  h2 {
    font-size: 16px;
    font-weight: 900;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #000;
  }

  h3 {
    font-size: 15px;
    font-weight: 900;
    margin-top: 15px;
    margin-bottom: 8px;
    color: #000;
  }

  strong {
    font-weight: 700;
    color: #000;
  }

  ul {
    padding-left: 20px;
    list-style: none;
  }

  li {
    margin-bottom: 5px;
  }

  /* 이미지 우측의 '목록' 텍스트를 표현 */
  &:after {
    content: "목록";
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    font-size: 20px;
    font-weight: 900;
    color: #000;
    opacity: 0.5;
    pointer-events: none;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

/* =========================
   Content Data (공지사항 이미지 내용)
========================= */

const NOTICE_CONTENT = (
  <>
    <p>안녕하세요, 줍줍 여러분!</p>
    <p>
      줍줍은 투명하고 안전한 온라인 경매 거래 환경을 제공하기 위해 다음과 같은
      이용 규정을 마련했습니다. 모든 회원분들께서는 본 규정을 숙지하시고 준수해
      주시길 바랍니다.
    </p>

    <h2>1. 경매의 종류 및 정의</h2>
    <p>
      경매 종류는 상품의 성격과 판매 규모에 따라 두 가지 형태의 경매를
      운영합니다.
    </p>

    <h3>1.1. 소규모 경매</h3>
    <ul>
      <li>
        <strong>정의:</strong> 기존 중고 물품 거래 방식과 유사한 일반적인 중고
        물품 판매 방식으로 진행됩니다.
      </li>
      <li>
        <strong>특징:</strong> 입찰자의 수나 금액의 한도 없이 실시간 경매 진행이
        가능합니다.
      </li>
    </ul>

    <h3>1.2. 대규모 경매 (고가/희소성 경매)</h3>
    <ul>
      <li>
        <strong>정의:</strong> 고가 물품(중고)이나 희귀한 기증 물품(새 물품)
        또는 희소성 있는 물품으로 온라인 경매를 진행합니다.
      </li>
      <li>
        <strong>특징:</strong> 판매자는 별도의 심사 과정을 통해 선 판매자로
        선정되어야 합니다.
      </li>
    </ul>

    <h3>1.3. 입찰 규정</h3>
    <p>i. 판매자는 등록한 물품의 하자, 완전성, 정품 여부 등을 심사합니다.</p>
    <p>
      ii. 승인된 물품에 한하여 경매에 참여하며, 승인된 물품에 한하여 경매에
      참여합니다.
    </p>
    <p>iii. 위반 행위는 불량 회원으로 간주하여 영구 정지 처분될 수 있습니다.</p>

    <h2>2. 상품 결제 및 배송</h2>
    <p>
      상품은 낙찰 후... (중략) 배송료는 낙찰 후 구매자에게 부과되며, 사이트
      정책에 따라 배송이 진행될 예정입니다.
    </p>

    <h2>3. 개인 정보 수집 및 이용 규정</h2>
    <ul>
      <li>
        <strong>3.1. 개인 정보 수집:</strong> 회원 가입 시 이메일, 닉네임,
        연락처 등 최소한의 정보만을 수집합니다.
      </li>
      <li>
        <strong>3.2. 개인 정보 이용:</strong> 수집된 정보는 서비스 제공 및
        개선에만 이용됩니다.
      </li>
      <li>
        <strong>3.3. 금지 행위:</strong> 관련 법규 위반 행위는 엄격히 금지되며,
        적발 시 즉시 제재 조치됩니다.
      </li>
    </ul>

    <h2>4. 기타 문의 및 협력</h2>
    <p>궁금한 점이 있으시면 언제든지 고객센터로 문의해 주십시오.</p>
  </>
);

/* =========================
   Component
========================= */

const Notice = () => {
  return (
    <Container>
      <ContentBox>
        <TitleBar>줍줍 경매 사이트 이용 규정 (공지사항)</TitleBar>

        <ContentSection>{NOTICE_CONTENT}</ContentSection>
      </ContentBox>
    </Container>
  );
};

export default Notice;
