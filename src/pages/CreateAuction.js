import styled from "styled-components";
import { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import ImageUploader from "../components/ImageUploader";
import { createAuction } from "../api/auctionApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* =====================
    styled
===================== */

const Container = styled.div`
  max-width: 900px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: "Noto Sans KR", sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 32px;
`;

const TypeSelect = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
`;

const TypeCard = styled.div`
  flex: 1;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid ${(props) => (props.active ? "#000" : "#f0f0f0")};
  background: ${(props) => (props.active ? "#fff" : "#fafafa")};
  cursor: pointer;
  text-align: center;
  transition: 0.2s;
  .type-title {
    display: block;
    font-family: "dnf bitbit v2", sans-serif;
    font-size: 16px;
    color: ${(props) => (props.active ? "#000" : "#999")};
  }
`;

const FormCard = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #eee;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const InputsColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  width: 90px;
  font-weight: 700;
  font-size: 14px;
  color: #333;
`;

/* ✅ 모든 옵션 인풋의 길이를 280px로 통일 */
const COMMON_WIDTH = "280px";

const StyledInput = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fdfdfd;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  width: ${(props) => (props.full ? "100%" : COMMON_WIDTH)};
  &:focus {
    border-color: #000;
    background: #fff;
  }
`;

const CurrencyWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 10px;
  width: ${COMMON_WIDTH}; /* 길이 통일 */
  overflow: hidden;
  box-sizing: border-box;
  &:focus-within {
    border-color: #000;
    background: #fff;
  }
  input {
    border: none;
    background: none;
    outline: none;
    padding: 12px 14px;
    width: 100%;
    font-size: 14px;
    text-align: right;
  }
  .unit {
    background: #f1f1f1;
    color: #666;
    font-size: 11px;
    font-weight: 800;
    padding: 0 12px;
    height: 42px;
    display: flex;
    align-items: center;
    border-left: 1px solid #eee;
    flex-shrink: 0;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  margin-top: 30px;
  padding: 18px;
  border-radius: 16px;
  border: none;
  background: #000;
  color: #fff;
  font-family: "dnf bitbit v2", sans-serif;
  font-size: 17px;
  cursor: pointer;
  &:hover {
    background: #333;
  }
`;

/* =====================
    Component
===================== */

const CreateAuction = () => {
  const editorRef = useRef();
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  const [auctionFormData, setAuctionFormData] = useState({
    auctionType: "",
    category: "",
    sellerId: user.id,
    itemName: "",
    itemDesc: "",
    startPrice: "",
    minBidUnit: "1000",
    startTime: "",
    endTime: "",
    itemImg: "",
  });

  const handleAuctionFormChange = (e) => {
    const { name, value } = e.target;
    setAuctionFormData((prev) => ({ ...prev, [name]: value }));
  };

  const auctionFormSubmit = async (e) => {
    e.preventDefault();
    console.log(auctionFormData);
    const result = await createAuction(auctionFormData);
    alert(result);
    if (result)
      navigate("/auction/" + auctionFormData.auctionType.toLowerCase());
  };

  return (
    <Container>
      <Title>나만의 경매 시작하기</Title>

      <TypeSelect>
        <TypeCard
          active={auctionFormData.auctionType === "MINOR"}
          name="auctionType"
          value="MINOR"
          onClick={() =>
            setAuctionFormData((prev) => ({ ...prev, auctionType: "MINOR" }))
          }
        >
          <span className="type-title">소규모 경매</span>
        </TypeCard>

        <TypeCard
          active={auctionFormData.auctionType === "MAJOR"}
          name="auctionType"
          value="MAJOR"
          onClick={() =>
            setAuctionFormData((prev) => ({ ...prev, auctionType: "MAJOR" }))
          }
        >
          <span className="type-title">대규모 경매</span>
        </TypeCard>
      </TypeSelect>

      {auctionFormData.auctionType && (
        <FormCard>
          {/* 1. 상품명 (전체 너비) */}
          <TitleRow>
            <Label>상품명</Label>
            <StyledInput
              full
              placeholder="경매 물품의 이름을 입력해 주세요"
              name="itemName"
              onChange={handleAuctionFormChange}
            />
          </TitleRow>

          <OptionsContainer>
            {/* 2. 왼쪽: 길이가 완벽하게 통일된 옵션들 */}
            <InputsColumn>
              <Row>
                <Label>입찰시작가</Label>
                <CurrencyWrapper>
                  <input
                    type="number"
                    placeholder="0"
                    name="startPrice"
                    onChange={handleAuctionFormChange}
                  />
                  <div className="unit">ZC</div>
                </CurrencyWrapper>
              </Row>
              <Row>
                <Label>입찰 단위</Label>
                <CurrencyWrapper>
                  <input
                    type="number"
                    defaultValue="1000"
                    name="minBidUnit"
                    onChange={handleAuctionFormChange}
                  />
                  <div className="unit">ZC</div>
                </CurrencyWrapper>
              </Row>
              {auctionFormData.auctionType === "MINOR" && (
                <>
                  <Row>
                    <Label>시작 시간</Label>
                    <StyledInput
                      type="datetime-local"
                      name="startTime"
                      onChange={handleAuctionFormChange}
                    />
                  </Row>
                  <Row>
                    <Label>종료 시간</Label>
                    <StyledInput
                      type="datetime-local"
                      name="endTime"
                      onChange={handleAuctionFormChange}
                    />
                  </Row>
                </>
              )}
              {auctionFormData.auctionType === "MAJOR" && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "12px",
                    background: "#f9f9f9",
                    borderRadius: "10px",
                    width: "280px",
                    boxSizing: "border-box",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    * 대규모 경매는 관리자가 <br /> 최종 승인 시 일정을
                    확정합니다.
                  </p>
                </div>
              )}
            </InputsColumn>

            {/* 3. 오른쪽: 남는 여백에 대표 이미지 */}
            <div style={{ flexShrink: 0 }}>
              <Label style={{ display: "block", marginBottom: "8px" }}>
                대표 이미지
              </Label>
              <ImageUploader
                name={"itemImg"}
                onChange={handleAuctionFormChange}
              ></ImageUploader>
            </div>
          </OptionsContainer>

          {/* 4. 하단 상세 설명 */}
          <div style={{ marginTop: "20px" }}>
            <Label style={{ display: "block", marginBottom: "12px" }}>
              상품 상세 설명
            </Label>
            <Editor
              ref={editorRef}
              height="350px"
              initialEditType="wysiwyg"
              previewStyle="vertical"
              placeholder="상세한 상품 정보를 입력해 주세요."
              name={"itemDesc"}
              onChange={() => {
                setAuctionFormData((prev) => ({
                  ...prev,
                  itemDesc: editorRef.current.getInstance().getMarkdown(),
                }));
              }}
            />
            <SubmitBtn onClick={auctionFormSubmit}>
              {auctionFormData.auctionType === "MAJOR"
                ? "경매 승인 신청하기"
                : "경매 즉시 등록하기"}
            </SubmitBtn>
          </div>
        </FormCard>
      )}
    </Container>
  );
};

export default CreateAuction;
