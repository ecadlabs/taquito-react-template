import React from "react";

type WalletTabProps = {
  userAddress: string;
  disconnectWallet: any;
};

const WalletTab = ({
  userAddress,
  disconnectWallet
}: WalletTabProps): JSX.Element => {
  return userAddress ? (
    <div className="wallet-tab" onClick={disconnectWallet}>
      <i className="fa fa-power-off" />
      &nbsp;&nbsp; {userAddress.slice(0, 5)}...{userAddress.slice(-5)}
    </div>
  ) : (
    <div></div>
  );
};

export default WalletTab;
