import * as React from "react";
import "../App.css";

const pinStyle = {
  stroke: "none",
  borderRadius: "6px",
  margin: "20px",
};

function NftDialog({ nft, onClose }) {
  return (
    <div className="dialog-container" onClick={onClose}>
      <form className="dialog">
        {nft.title}, {nft.author}
        <img width="235px" height="235px" src={nft.image} style={pinStyle} />
        {nft.price}
        <a
          target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${nft.title}, ${nft.author}`}
        >
          Mint
        </a>
      </form>
    </div>
  );
}

export default React.memo(NftDialog);
