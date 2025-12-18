import styled from "styled-components";
import React from "react";
import LogoImage2 from "../Images/LogoImage2.png";

/* =========================
   Styled Components
========================= */

const FooterContainer = styled.footer`
  width: 100%;
  background: #f8f8f8;
  padding: 40px 0 20px 0;
  border-top: 1px solid #ddd;
  color: #333;
  font-family: "dnf bitbit v2", sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 60px;

  @media (max-width: 1000px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const LogoSection = styled.div`
  flex-shrink: 0;
`;

const LogoImageContainer = styled.div`
  width: 130px;
  height: 130px;
  background-image: url(${(props) => props.src?.LogoImage2});
  background-size: contain;
  background-repeat: no-repeat;
  margin-bottom: 10px;
`;

/* --- ✅ 이 부분의 height를 55px로 고정해서 3줄씩 끊기게 만들었습니다 --- */
const VerticalWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 55px; /* 10px 폰트 기준 3줄 높이 */
  gap: 0 40px;
  width: fit-content;

  @media (max-width: 800px) {
    height: auto;
    flex-wrap: nowrap;
  }
`;

const InfoSection = styled.div`
  flex-shrink: 0;
`;

const InfoTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
`;

const InfoItem = styled.p`
  font-size: 10px; /* 원본 유지 */
  line-height: 1.8;
  white-space: nowrap;
  margin: 0;
`;

const LinkSection = styled.div`
  flex-shrink: 0;
`;

const PolicyLink = styled.a`
  font-size: 10px; /* 원본 유지 */
  color: #333;
  text-decoration: none;
  line-height: 1.8;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
    color: #000;
  }
`;

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid #ccc;
  margin: 30px auto;
`;

const BottomSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const Copyright = styled.p`
  font-size: 13px;
  color: #555;
`;

const Slogan = styled.div`
  margin-right: 20px;
  font-family: "dnf bitbit v2", sans-serif;
  text-align: right;
  font-size: 16px;
  color: #000;
  line-height: 1.4;
  span {
    font-size: 20px;
  }
`;

/* =========================
   Component
========================= */

const Footer = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
        <LogoSection>
          <LogoImageContainer src={{ LogoImage2 }} />
        </LogoSection>

        <InfoSection>
          <InfoTitle>법적 고지</InfoTitle>
          <VerticalWrap>
            <InfoItem>© 2025 ZubZub Inc. All Rights Reserved</InfoItem>
            <InfoItem>사업자등록번호: 000-00-00000</InfoItem>
            <InfoItem>통신판매업 신고번호: 제0000-0000호</InfoItem>
            <InfoItem>대표 : 양찬종</InfoItem>
            <InfoItem>주소: 서울특별시 00구 00로 00</InfoItem>
            <InfoItem>고객센터: 0000-0000 / support@zubzub.com</InfoItem>
          </VerticalWrap>
        </InfoSection>

        <LinkSection>
          <InfoTitle>정책 링크</InfoTitle>
          <VerticalWrap>
            <PolicyLink href="/policy/terms">이용약관</PolicyLink>
            <PolicyLink href="/policy/privacy">개인정보처리방침</PolicyLink>
            <PolicyLink href="/policy/youth">청소년 보호정책</PolicyLink>
            <PolicyLink href="/etc/dispute">
              전자상거래 분쟁 조정 안내
            </PolicyLink>
            <PolicyLink href="/etc/seller-join">
              업체/판매자 입점 안내
            </PolicyLink>
          </VerticalWrap>
        </LinkSection>
      </ContentWrapper>

      <Divider />

      <BottomSection>
        <Copyright>© 2025 ZubZub Inc. All Rights Reserved.</Copyright>
        <Slogan>
          “가치를 다시 줍다. <span>줍줍(ZubZub)</span>”
          <br />
          안전하고 투명한 중고 경매 플랫폼을 지향합니다.
        </Slogan>
      </BottomSection>
    </FooterContainer>
  );
};

export default Footer;
