import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { uploadFile } from "../api/firebase";

const PhotoPreviewBox = styled.label`
  width: 230px;
  height: 230px;
  background: #f8f8f8;
  border: 2px dashed #eee;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border-color: #000;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .plus {
    font-size: 24px;
    color: #bbb;
    margin-bottom: 4px;
  }
  span {
    font-size: 12px;
    color: #aaa;
  }
`;

const ImageUploader = ({ name, value, onChange }) => {
  const [file, setFile] = useState(null); // 업로드할 파일
  const [url, setUrl] = useState(value || ""); // 업로드 후 이미지 URL

  // 파일 선택 핸들러
  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 업로드 버튼 클릭 핸들러
  const handleUpload = () => {
    if (!file) return;
    uploadFile(file) // 파일 업로드
      .then((downloadUrl) => {
        console.log("파일 업로드 성공!");
        console.log("저장된 경로:", downloadUrl);
        setUrl(downloadUrl); // 이미지 URL 상태 업데이트
        onChange({
          target: {
            name,
            value: downloadUrl,
          },
        });
      })
      .catch((error) => {
        console.error("업로드 중 에러 발생:", error);
      });
  };

  useEffect(handleUpload, [file]);

  return (
    <PhotoPreviewBox>
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileInputChange}
      />
      {url ? (
        <img src={url} alt="미리보기" />
      ) : (
        <>
          <div className="plus">+</div>
          <span>사진 추가</span>
        </>
      )}
    </PhotoPreviewBox>
  );
};

export default ImageUploader;
