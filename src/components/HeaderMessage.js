import styled from "styled-components";
import { useState } from "react";
import MessageModal from "./MessageModal";

const IconWrap = styled.div`
  position: relative;
  cursor: pointer;
`;

const MessageIcon = styled.div`
  font-size: 22px;
`;

const UnreadDot = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
`;

const HeaderMessage = () => {
  const [open, setOpen] = useState(false);

  // 🔥 나중에 서버에서 unreadCount로 대체
  const unreadCount = 1;

  return (
    <>
      <IconWrap onClick={() => setOpen(true)}>
        <MessageIcon>✉️</MessageIcon>
        {unreadCount > 0 && <UnreadDot />}
      </IconWrap>

      {open && <MessageModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default HeaderMessage;
