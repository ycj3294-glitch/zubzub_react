import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoImage1 from "../images/LogoImage1.png";
import MessageModal from "./common/MessageModal";

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
    flex: 1; /* ✅ 로그인과 회원가입이 50:50으로 공간을 나눠가짐 */
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

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

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
                  대규모 경매
                </span>
                <span onClick={() => navigate("/auction/minor")}>
                  소규모 경매
                </span>
                <span onClick={() => navigate("/schedule")}>경매 일정</span>
                <span onClick={() => navigate("/notice")}>공지사항</span>
              </MenuRow>
            </CenterSection>
            <RightSection>
              <TopRightRow>
                <AuthBox>
                  {!isLoggedIn ? (
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
                    </>
                  )}
                </AuthBox>
              </TopRightRow>
              <StartAuctionBtnWrapper>
                <StartAuctionBtn onClick={() => navigate("/create-auction")}>
                  나만의 경매 시작하기
                </StartAuctionBtn>
              </StartAuctionBtnWrapper>
            </RightSection>
          </TopSection>
          <BottomDivider />
        </HeaderContainer>
      </HeaderWrapper>

      {showMessageModal && (
        <MessageModal onClose={() => setShowMessageModal(false)} />
      )}
    </>
  );
};

export default Header;
