import { useState } from "react";
import { createAuction } from "../../api/auctionApi";
import ImageUploader from "../ImageUploader";

const CreateAuction = () => {
  const [auctionFormData, setAuctionFormData] = useState({
    auctionType: "",
    category: "",
    sellerId: "",
    itemName: "",
    itemDesc: "",
    startPrice: "",
    startTime: "",
    endTime: "",
    itemImg: "",
  });

  const auctionFields = [
    { label: "경매 유형", name: "auctionType", type: "text" },
    { label: "카테고리", name: "category", type: "text" },
    { label: "판매자 ID", name: "sellerId", type: "number" },
    { label: "상품명", name: "itemName", type: "text" },
    { label: "상품 설명", name: "itemDesc", type: "textarea" },
    { label: "시작가", name: "startPrice", type: "number" },
    { label: "시작 시간", name: "startTime", type: "datetime-local" },
    { label: "종료 시간", name: "endTime", type: "datetime-local" },
  ];
  const handleAuctionFormChange = (e) => {
    const { name, value } = e.target;
    setAuctionFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("폼데이터", auctionFormData);
            const result = await createAuction(auctionFormData);
            alert(result);
          }}
        >
          {auctionFields.map((field) => (
            <div key={field.name} style={{ marginBottom: "15px" }}>
              <label>
                {field.label}:{" "}
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={auctionFormData[field.name]}
                    onChange={handleAuctionFormChange}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={auctionFormData[field.name]}
                    onChange={handleAuctionFormChange}
                  />
                )}
              </label>
            </div>
          ))}
          <ImageUploader
            name={"itemImg"}
            value={auctionFormData["itemImg"]}
            onChange={handleAuctionFormChange}
          ></ImageUploader>
          <button type="submit">등록하기</button>
        </form>
      </div>
    </>
  );
};
export default CreateAuction;
