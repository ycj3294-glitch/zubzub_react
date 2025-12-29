import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoImage1 from "../images/LogoImage1.png";
import MessageModal from "./MessageModal";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import AxiosApi from "../api/AxiosAPI";

/* =========================
   [추가] 로그인 안내 커스텀 모달 스타일
========================= */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  width: 340px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

  p {
    font-size: 16px;
    margin-bottom: 25px;
    line-height: 1.6;
    color: #333;
    word-break: keep-all;
    font-family: sans-serif; /* 가독성을 위해 기본 서체 사용 */
  }

  button {
    background: #000;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    &:hover {
      background: #333;
    }
  }
`;

/* =========================
   기존 Styled Components
========================= */
const HeaderWrapper = styled.div`
  width: 100%;
  height: 135px;
  position: relative;
`;

const HeaderContainer = styled.header`
  width: 100%;
  background: #fff;
  padding: 15px 0 0 0;
  font-family: "dnf bitbit v2", sans-serif;
  font-weight: normal;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  @media (max-width: 900px) {
    display: none; /* 모바일에서는 숨김 */
  }
`;

const TopSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 110px;
  height: auto;
  cursor: pointer;
`;

const CenterSection = styled.div`
  flex: 1;
  max-width: 550px;
  margin: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  width: 100%;

  span {
    font-size: 15px;
    cursor: pointer;
    color: #000;
    text-align: center;
    flex: 1;
    position: relative;
    &:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 10px;
      background: #ccc;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 220px;
  height: 80px;
`;

const TopRightRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const AuthBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  background: #fafafa;
  border-radius: 2px;
  height: 32px;
  width: 100%;

  span {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #555;
    cursor: pointer;
    line-height: 1;
    &:hover {
      color: #000;
    }
  }

  .divider {
    width: 1px;
    height: 12px;
    background: #ddd;
    flex-shrink: 0;
  }
`;

const StartAuctionBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #000;
  padding-bottom: 5px;
`;

const StartAuctionBtn = styled.div`
  font-size: 16px;
  cursor: pointer;
  color: #000;
  white-space: nowrap;
`;

const BottomDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eee;
  margin: 0;
`;

const AdminButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  border: 1px solid #000;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  background: #000;
  color: #fff;
  margin-bottom: 8px;

  &:hover {
    background: #333;
  }
`;

/* =========================
모바일용
========================= */

const MobileHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌우 공간 분배 */
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;

  @media (min-width: 900px) {
    display: none; /* 데스크톱에서는 숨김 */
  }
`;

const MobileLogo = styled.img`
  width: 80px;
  height: auto;
  cursor: pointer;
`;

const MobileSearchWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  justify-content: center;
  margin: 0 12px;
`;

const HamburgerButton = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: 24px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  span {
    display: block;
    height: 3px;
    background: #000;
    border-radius: 2px;
  }
`;

const HeaderMenuContainer = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: ${({ open }) => (open ? "block" : "none")};
    position: relative;
    top: 0px; /* MobileHeaderContainer 바로 아래 */
    right: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 2000;
  }
`;

const HeaderMenu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const HeaderMenuItem = styled.li`
  padding: 14px 16px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:first-child {
    border-top: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

/* =========================
   Component Main
========================= */
const Header = () => {
  const navigate = useNavigate();
  const { isLogin, logout, user, setAccessToken } = useAuth();
  const isAdmin = user?.isAdmin;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showLoginGuide, setShowLoginGuide] = useState(false); // 로그인 유도 모달 상태

  const [menuOpen, setMenuOpen] = useState();

  const logoutHandler = async () => {
    const res = await AxiosApi.logout();
    if (res.status === 200 || res.status === 201) {
      logout();
      setAccessToken(null);
      navigate("/");
    }
  };

  // ✅ 버튼 클릭 핸들러
  const handleStartAuction = () => {
    if (!isLogin) {
      setShowLoginGuide(true); // 로그인 안 되어 있으면 모달 오픈
    } else {
      navigate("/create-auction"); // 되어 있으면 페이지 이동
    }
  };

  // ✅ 모달 확인 버튼 클릭 시
  const confirmAndGoLogin = () => {
    setShowLoginGuide(false);
    navigate("/login");
  };

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <TopSection>
            <Logo src={LogoImage1} alt="Logo" onClick={() => navigate("/")} />

            <CenterSection>
              <SearchBar />
              <MenuRow>
                <span onClick={() => navigate("/auction/major")}>
                  프리미엄 경매
                </span>
                <span onClick={() => navigate("/auction/minor")}>
                  데일리 경매
                </span>
                <span onClick={() => navigate("/schedule")}>경매 일정</span>
                <span onClick={() => navigate("/notice")}>공지사항</span>
              </MenuRow>
            </CenterSection>

            <RightSection>
              {isAdmin && (
                <AdminButton onClick={() => navigate("/admin")}>
                  관리 페이지
                </AdminButton>
              )}

              <TopRightRow>
                <AuthBox>
                  {!isLogin ? (
                    <>
                      <span onClick={() => navigate("/login")}>로그인</span>
                      <div className="divider" />
                      <span onClick={() => navigate("/signup")}>회원가입</span>
                    </>
                  ) : (
                    <>
                      <span onClick={() => setShowMessageModal(true)}>
                        쪽지함
                      </span>
                      <div className="divider" />
                      <span onClick={() => navigate("/mypage")}>
                        마이페이지
                      </span>
                      <div className="divider" />
                      <span onClick={logoutHandler}>로그아웃</span>
                    </>
                  )}
                </AuthBox>
              </TopRightRow>
              {isLogin && (
                <StartAuctionBtnWrapper>
                  <StartAuctionBtn onClick={handleStartAuction}>
                    나만의 경매 시작하기
                  </StartAuctionBtn>
                </StartAuctionBtnWrapper>
              )}
            </RightSection>
          </TopSection>
          <BottomDivider />
        </HeaderContainer>
        <MobileHeaderContainer>
          <MobileLogo
            src={LogoImage1}
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <MobileSearchWrapper>
            <SearchBar />
          </MobileSearchWrapper>
          <HamburgerButton onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </HamburgerButton>
        </MobileHeaderContainer>
        <HeaderMenuContainer open={menuOpen}>
          <HeaderMenu onClick={() => setMenuOpen(!menuOpen)}>
            {/* 로그인 안 했을 때만 보이는 메뉴 */}
            {!isLogin && (
              <>
                <HeaderMenuItem onClick={() => navigate("/login")}>
                  로그인
                </HeaderMenuItem>
                <HeaderMenuItem onClick={() => navigate("/signup")}>
                  회원가입
                </HeaderMenuItem>
              </>
            )}

            {/* 관리자 계정일 때만 보이는 메뉴 */}
            {isAdmin && (
              <HeaderMenuItem onClick={() => navigate("/admin")}>
                관리 페이지
              </HeaderMenuItem>
            )}

            {/* 로그인 했을 때만 보이는 메뉴 */}
            {isLogin && (
              <>
                <HeaderMenuItem onClick={() => setShowMessageModal(true)}>
                  쪽지함
                </HeaderMenuItem>
                <HeaderMenuItem onClick={() => navigate("/mypage")}>
                  마이페이지
                </HeaderMenuItem>
                <HeaderMenuItem onClick={logoutHandler}>
                  로그아웃
                </HeaderMenuItem>
                <HeaderMenuItem onClick={handleStartAuction}>
                  나만의 경매 시작하기
                </HeaderMenuItem>
              </>
            )}

            {/* 공통 메뉴 (누구나 보임) */}
            <HeaderMenuItem onClick={() => navigate("/auction/major")}>
              프리미엄 경매
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => navigate("/auction/minor")}>
              데일리 경매
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => navigate("/schedule")}>
              경매 일정
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => navigate("/notice")}>
              공지사항
            </HeaderMenuItem>
          </HeaderMenu>
        </HeaderMenuContainer>
      </HeaderWrapper>

      {/* 쪽지함 모달 */}
      {showMessageModal && (
        <MessageModal onClose={() => setShowMessageModal(false)} />
      )}

      {/* ✅ [추가] 로그인 안내 커스텀 모달 */}
      {showLoginGuide && (
        <ModalOverlay onClick={() => setShowLoginGuide(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <p>
              줍줍 회원만 이용할 수 있습니다.
              <br />
              로그인 페이지로 이동하시겠습니까?
            </p>
            <button onClick={confirmAndGoLogin}>로그인하러 가기</button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Header;
