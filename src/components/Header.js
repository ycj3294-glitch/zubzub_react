import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeaderWrap = styled.header`
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
  position: sticky;
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  margin-left: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #111;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  margin-right: 10px;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  font-size: 14px;
  color: #333;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  font-size: 14px;
`;

/* =========================
   Component
========================= */

const Header = () => {
  const { isLogin, user, logout } = useAuth();
  const nav = useNavigate();

  const logoutHandler = () => {
    logout();
    nav("/login");
  };

  return (
    <HeaderWrap>
      <Inner>
        {/* 로고 */}
        <Logo to="/">ZUBZUB</Logo>

        {/* 네비게이션 */}
        <Nav>
          <NavLink to="/auction">경매</NavLink>
          <NavLink to="/about">서비스 소개</NavLink>

          {isLogin ? (
            <>
              <span>{user?.email}</span>
              <Button onClick={logoutHandler}>로그아웃</Button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </Nav>
      </Inner>
    </HeaderWrap>
  );
};

export default Header;
