import React from "react";
import styled from "styled-components";
import LogoImage1 from "../LogoImage1.png";

/* =========================
   Styled Components
========================= */

const HeaderContainer = styled.header`
  width: 100%;
  background: #fff;
  /* ✅ 상단 여백 30px -> 15px로 축소, 하단 여백 15px -> 25px로 확대 */
  padding: 15px 0 25px 0;
  font-family: "dnf bitbit v2", sans-serif;
  font-weight: normal;
`;

const TopSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 20px;
`;

const Logo = styled.img`
  width: 110px;
  height: auto;
  cursor: pointer;
  /* ✅ 상단 여백이 줄어든 만큼 로고 위치 미세 조정 */
  margin-top: 0;
`;

/* --- 중앙 영역 --- */
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

/* --- 우측 영역 --- */
const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 75px;
`;

const TopRightRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
`;

const MailIcon = styled.div`
  width: 24px;
  height: 15px;
  border: 1.5px solid #333;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 7px;
    border-bottom: 1px solid #333;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
  }
`;

const AuthBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  background: #fafafa;
  border-radius: 2px;
  height: 30px;
  flex: 1;

  span {
    font-size: 12px;
    color: #555;
    cursor: pointer;
    &:hover {
      color: #000;
    }
  }

  .divider {
    width: 1px;
    height: 10px;
    background: #ddd;
    margin: 0 8px;
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
  letter-spacing: -0.5px;
  white-space: nowrap;
`;

/* ✅ 메인페이지와 구분하는 연한 회색 하단 구분선 */
const BottomDivider = styled.div`
  width: 1150px;
  height: 1px;
  background-color: #eee; /* 연한 회색 */
  margin: 0 auto; /* 중앙 배치 */
`;

/* =========================
   Component
========================= */

const Header = () => {
  return (
    <>
      <HeaderContainer>
        <TopSection>
          <Logo src={LogoImage1} alt="ZubZub Logo" />

          <CenterSection>
            <SearchBox>
              <SearchInput type="text" />
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
            </SearchBox>
            <MenuRow>
              <span>대규모 경매</span>
              <span>소규모 경매</span>
              <span>경매 일정</span>
              <span>공지사항</span>
            </MenuRow>
          </CenterSection>

          <RightSection>
            <TopRightRow>
              <MailIcon title="쪽지함" />
              <AuthBox>
                <span>로그인</span>
                <div className="divider" />
                <span>회원가입</span>
              </AuthBox>
            </TopRightRow>
            <StartAuctionBtnWrapper>
              <StartAuctionBtn>나만의 경매 시작하기</StartAuctionBtn>
            </StartAuctionBtnWrapper>
          </RightSection>
        </TopSection>
      </HeaderContainer>
      {/* ✅ 헤더 외부에 구분선 배치 */}
      <BottomDivider />
    </>
  );
};

export default Header;
