import styled from "styled-components";
import { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

/* =====================
   styled
===================== */

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 16px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const TypeSelect = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TypeCard = styled.div`
  flex: 1;
  padding: 24px;
  border-radius: 20px;
  border: 2px solid ${(props) => (props.active ? "#111" : "#ddd")};
  cursor: pointer;
  text-align: center;
  font-weight: bold;
`;

const Form = styled.form`
  display: grid;
  gap: 20px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
`;

const Info = styled.p`
  font-size: 13px;
  color: #777;
`;

const SubmitBtn = styled.button`
  margin-top: 30px;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #111;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
`;

/* =====================
   Component
===================== */

const CreateAuction = () => {
  const [type, setType] = useState(null);
  const editorRef = useRef();

  const [form, setForm] = useState({
    title: "",
    startPrice: "",
    bidUnit: 1000,
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!type) {
      alert("경매 유형을 선택하세요.");
      return;
    }

    if (type === "MINOR" && (!form.startDate || !form.endDate)) {
      alert("소규모 경매는 시작/종료 시간을 설정해야 합니다.");
      return;
    }

    const description = editorRef.current.getInstance().getHTML();

    const payload = {
      type, // MINOR | MAJOR
      title: form.title,
      startPrice: form.startPrice,
      bidUnit: form.bidUnit,
      startDate: type === "MINOR" ? form.startDate : null,
      endDate: type === "MINOR" ? form.endDate : null,
      description,
    };

    console.log("경매 등록 데이터:", payload);
    alert(
      type === "MAJOR"
        ? "대규모 경매 신청 완료 (관리자 승인 대기)"
        : "소규모 경매 등록 완료"
    );
  };

  return (
    <Container>
      <Title>나만의 경매 시작하기</Title>

      {/* 경매 유형 선택 */}
      <TypeSelect>
        <TypeCard active={type === "MINOR"} onClick={() => setType("MINOR")}>
          소규모 경매
          <Info>사용자가 경매 시간을 직접 설정</Info>
        </TypeCard>

        <TypeCard active={type === "MAJOR"} onClick={() => setType("MAJOR")}>
          대규모 경매
          <Info>관리자가 시작 일정을 지정</Info>
        </TypeCard>
      </TypeSelect>

      {type && (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Label>상품명</Label>
            <Input name="title" onChange={handleChange} />
          </Row>

          <Row>
            <Label>시작가</Label>
            <Input type="number" name="startPrice" onChange={handleChange} />
          </Row>

          <Row>
            <Label>입찰 단위</Label>
            <Input
              type="number"
              name="bidUnit"
              value={form.bidUnit}
              onChange={handleChange}
            />
          </Row>

          {/* 🔥 소규모 경매 시간 설정 */}
          {type === "MINOR" && (
            <>
              <Row>
                <Label>시작 시간</Label>
                <Input
                  type="datetime-local"
                  name="startDate"
                  onChange={handleChange}
                />
              </Row>

              <Row>
                <Label>종료 시간</Label>
                <Input
                  type="datetime-local"
                  name="endDate"
                  onChange={handleChange}
                />
              </Row>
            </>
          )}

          {/* 🔥 대규모 안내 */}
          {type === "MAJOR" && (
            <Info>
              ※ 대규모 경매는 관리자 승인 후 시작 일정이 자동으로 설정됩니다.
            </Info>
          )}

          {/* 무료 에디터 */}
          <Row>
            <Label>상품 설명</Label>
            <Editor
              ref={editorRef}
              height="300px"
              initialEditType="wysiwyg"
              previewStyle="vertical"
              placeholder="상품 설명을 입력하세요"
              useCommandShortcut={true}
            />
          </Row>

          <SubmitBtn>
            {type === "MAJOR" ? "경매 신청하기" : "경매 등록하기"}
          </SubmitBtn>
        </Form>
      )}
    </Container>
  );
};

export default CreateAuction;
