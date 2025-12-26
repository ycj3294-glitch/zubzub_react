import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoImage1 from "../images/LogoImage1.png";
import MessageModal from "./MessageModal";
import { useAuth } from "../context/AuthContext";
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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 8px 15px;
  width: 100%;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  font-family: inherit;
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  &::before {
    content: "";
    width: 1px;
    height: 16px;
    background: #ccc;
  }
`;

const SearchIcon = styled.div`
  width: 18px;
  height: 18px;
  border: 1.5px solid #666;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 1.5px;
    background: #666;
    bottom: -2px;
    right: -3px;
    transform: rotate(45deg);
  }
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
  justify-content: space-between;
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

/* =========================
   Component Main
========================= */
const Header = () => {
  const navigate = useNavigate();
  const { isLogin, logout, setAccessToken } = useAuth();

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showLoginGuide, setShowLoginGuide] = useState(false); // 로그인 유도 모달 상태

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
              <SearchBox>
                <SearchInput type="text" placeholder="검색어를 입력하세요" />
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
              </SearchBox>
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
              <StartAuctionBtnWrapper>
                <StartAuctionBtn onClick={handleStartAuction}>
                  나만의 경매 시작하기
                </StartAuctionBtn>
              </StartAuctionBtnWrapper>
            </RightSection>
          </TopSection>
          <BottomDivider />
        </HeaderContainer>
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
