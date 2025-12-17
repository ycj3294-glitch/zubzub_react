import styled from "styled-components";
import { Link } from "react-router-dom";

/* =========================
   styles
========================= */

const FooterWrap = styled.footer`
  width: 100%;
  border-top: 1px solid #e5e5e5;
  background: #fafafa;
  margin-top: 60px;
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 0;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Nav = styled.nav`
  display: flex;
  gap: 16px;
`;

const NavLink = styled(Link)`
  font-size: 13px;
  color: #555;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Bottom = styled.div`
  font-size: 12px;
  color: #888;
  line-height: 1.6;
`;

/* =========================
   Component
========================= */

const Footer = () => {
  return (
    <FooterWrap>
      <Inner>
        {/* 상단 */}
        <Top>
          <Logo>ZUBZUB</Logo>

          <Nav>
            <NavLink to="/about">서비스 소개</NavLink>
            <NavLink to="/policy">이용약관</NavLink>
            <NavLink to="/privacy">개인정보처리방침</NavLink>
            <NavLink to="/cs">고객센터</NavLink>
          </Nav>
        </Top>

        {/* 하단 */}
        <Bottom>
          <div>상호명: 줍줍(ZUBZUB)</div>
          <div>대표자: 홍길동</div>
          <div>사업자등록번호: 123-45-67890</div>
          <div>주소: 서울특별시 어딘가</div>
          <div>© 2025 ZUBZUB. All rights reserved.</div>
        </Bottom>
      </Inner>
    </FooterWrap>
  );
};

export default Footer;
