import React from "react";

const DisconnectButton = ({ disconnectWallet }: any): JSX.Element => {
  return (
    <div className="buttons">
      <button className="button" onClick={disconnectWallet}>
        <i className="fas fa-times"></i>&nbsp; Disconnect wallet
      </button>
    </div>
  );
};

export default DisconnectButton;
