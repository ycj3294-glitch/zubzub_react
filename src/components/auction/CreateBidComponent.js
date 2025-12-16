import { useState } from "react";
import { createBid } from "../../api/auctionApi";

const CreateBidComponent = ({ auctionId }) => {
  const [bidFormData, setBidFormData] = useState({
    memberId: "",
    price: "",
  });

  const bidFields = [
    { label: "입찰자 ID", name: "memberId", type: "text" },
    { label: "입찰가", name: "price", type: "text" },
  ];
  const handleBidFormChange = (e) => {
    const { name, value } = e.target;
    setBidFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createBid(auctionId, bidFormData);
          }}
        >
          {bidFields.map((field) => (
            <div key={field.name} style={{ marginBottom: "15px" }}>
              <label>
                {field.label}:{" "}
                {
                  <input
                    type={field.type}
                    name={field.name}
                    value={bidFormData[field.name]}
                    onChange={handleBidFormChange}
                  />
                }
              </label>
            </div>
          ))}
          <button type="submit">입찰</button>
        </form>
      </div>
    </>
  );
};

export default CreateBidComponent;
