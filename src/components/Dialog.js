import * as React from "react";
import "../App.css";

const pinStyle = {
  // cursor: "pointer",
  stroke: "none",
  borderRadius: "6px",
  margin: "20px",
};

function Dialog({ nft, onClose }) {
  return (
    <div className="dialog-container" onClick={onClose}>
      <div className="dialog">
        {nft.title}, {nft.author}
        <img width="235px" height="235px" src={nft.image} style={pinStyle} />
        {nft.price}
        <a
          target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${nft.title}, ${nft.author}`}
        >
          Mint
        </a>
      </div>
    </div>
  );
}

export default React.memo(Dialog);
