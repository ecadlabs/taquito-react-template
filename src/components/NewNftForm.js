import * as React from "react";
import "../App.css";

const mockupImage =
  "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/240px-Above_Gotham.jpg";

function NftDialog({ nftLocation, setNftList, onClose }) {
  const formRef = React.useRef(null);

  const pinStyle = {
    stroke: "none",
    borderRadius: "6px",
    margin: "20px",
  };

  const handleSubmit = (formData) => {
    const newNftData = {
      title: formData.title.value,
      image: mockupImage,
      price: formData.price.value,
      longitude: nftLocation.longitude,
      latitude: nftLocation.latitude,
    };
    setNftList((prev) => [...prev, newNftData]);
  };

  return (
    <div className="dialog-container">
      <div className="dialog">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formRef.current);
          }}
          className="dialog"
        >
          <h2>Add my NFT artwork</h2>
          <input type="text" name="title" placeholder="Title" />
          <img
            width="235px"
            height="235px"
            src={mockupImage}
            style={pinStyle}
          />
          <input type="number" name="price" placeholder="Price" />
          <button type="submit">Publish</button>
        </form>
      </div>
      <div className="dialog-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default React.memo(NftDialog);
