import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* =====================
   styled (MyPage 기반)
===================== */

const Container = styled.div`
  max-width: 850px;
  margin: 40px auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 20px;
`;

const Title = styled.h2`
  margin-bottom: 30px;
`;

const ProfileRow = styled.div`
  display: flex;
  gap: 48px;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const ProfileImgWrap = styled.div`
  position: relative;
`;

const ProfileImg = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
`;

const EditIcon = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  border-radius: 50%;
  border: none;
  padding: 6px;
  cursor: pointer;
`;

const InfoBox = styled.div`
  flex: 0 0 520px;
  max-width: 520px;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0;
  font-size: 14px;

  input {
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 14px;
  border: none;
  background: #555;
  color: white;
  cursor: pointer;
`;

const CancelBtn = styled(Button)`
  background: #aaa;
`;

/* =====================
   Component
===================== */

const MyPageEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [profileImg, setProfileImg] = useState("/images/profile.jpg");

  const handleSave = () => {
    if (password && password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("개인정보가 수정되었습니다. (더미)");
    navigate("/mypage");
  };

  return (
    <Container>
      <Title>개인정보 수정</Title>

      {/* 프로필 사진 */}
      <ProfileRow>
        <ProfileImgWrap>
          <ProfileImg src={profileImg} />
          <EditIcon
            onClick={() => document.getElementById("profileUpload").click()}
          >
            ✎
          </EditIcon>
          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfileImg(URL.createObjectURL(file));
              }
            }}
          />
        </ProfileImgWrap>

        {/* 정보 수정 */}
        <InfoBox>
          <InfoRow>
            <strong>닉네임 변경</strong>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
            />
          </InfoRow>

          <InfoRow>
            <strong>비밀번호 변경</strong>
            <input
              type="password"
              placeholder="새 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </InfoRow>

          <ButtonRow>
            <CancelBtn onClick={() => navigate("/mypage")}>취소</CancelBtn>
            <Button onClick={handleSave}>저장</Button>
          </ButtonRow>
        </InfoBox>
      </ProfileRow>
    </Container>
  );
};

export default MyPageEdit;
