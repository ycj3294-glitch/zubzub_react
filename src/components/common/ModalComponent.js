import React from "react";
import styled, { keyframes, css } from "styled-components";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styled Components ---

// 1. 배경 (Overlay)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px); /* 배경 블러 효과 추가 */
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

// 2. 모달 창 (Container)
const ModalContainer = styled.section`
  width: 90%;
  max-width: 450px;
  background-color: #fff;
  border-radius: 12px; /* 둥근 모서리 */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); /* 부드러운 그림자 */
  overflow: hidden;
  animation: ${slideUp} 0.4s ease-out;
  display: flex;
  flex-direction: column;
`;

// 3. 헤더
const Header = styled.header`
  position: relative;
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

// 4. 본문
const Main = styled.main`
  padding: 24px 20px;
  font-size: 1rem;
  color: #495057;
  line-height: 1.5;
`;

// 5. 푸터
const Footer = styled.footer`
  padding: 12px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* 버튼 사이 간격 */
`;

// 6. 공통 버튼 스타일
const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  /* 취소 버튼 스타일 (기본) */
  background-color: #e9ecef;
  color: #495057;

  &:hover {
    background-color: #dee2e6;
  }

  /* 확인 버튼 스타일 (primary prop이 있을 때) */
  ${(props) =>
    props.primary &&
    css`
      background-color: #4dabf7;
      color: #fff;

      &:hover {
        background-color: #339af0;
      }
    `}
`;

const Modal = ({ open, confirm, close, type, header, children }) => {
  // 모달이 열려있지 않으면 렌더링하지 않음 (DOM 최적화)
  if (!open) return null;

  return (
    <Overlay onClick={close}>
      {/* e.stopPropagation: 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 방지 */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          {header}
          <CloseButton onClick={close}>&times;</CloseButton>
        </Header>

        <Main>{children}</Main>

        <Footer>
          <ActionButton onClick={close}>취소</ActionButton>
          {type && (
            <ActionButton primary onClick={confirm}>
              확인
            </ActionButton>
          )}
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
