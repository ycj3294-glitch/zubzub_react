import React, { useState } from "react";
import { uploadFile } from "../api/firebase";

const ImageUploader = ({ name, value, onChange }) => {
  const [file, setFile] = useState(null); // 업로드할 파일
  const [url, setUrl] = useState(value || ""); // 업로드 후 이미지 URL

  // 파일 선택 핸들러
  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 업로드 버튼 클릭 핸들러
  const handleUploadClick = () => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }
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

  return (
    <div>
      <input type="file" onChange={handleFileInputChange} />
      <button type="button" onClick={handleUploadClick}>
        Upload
      </button>
      {url && (
        <img
          src={url}
          style={{ width: "100px", height: "100px" }}
          alt="업로드 이미지"
        />
      )}{" "}
      {/* 업로드된 이미지 미리보기 */}
    </div>
  );
};

export default ImageUploader;
