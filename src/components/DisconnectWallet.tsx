import React from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";

type ButtonProps = {
  wallet: BeaconWallet | null;
  setPublicToken: (token: any) => any;
  setUserAddress: (address: any) => any;
  setUserBalance: (balance: any) => any;
  setWallet: (wallet: any) => any;
  setTezos: (tezos: any) => any;
};

const DisconnectButton: React.FC<ButtonProps> = ({
  wallet,
  setPublicToken,
  setUserAddress,
  setUserBalance,
  setWallet,
  setTezos,
}) => {
  const disconnectWallet = async () => {
    if (wallet) {
      await wallet.client.removeAllAccounts();
      await wallet.client.removeAllPeers();
      setPublicToken(null);
    }
    console.log("disconnecting wallet");
    window.localStorage.clear();
    setUserAddress(null);
    setUserBalance(0);
    setWallet(null);
    const tezosTK = new TezosToolkit("https://api.tez.ie/rpc/carthagenet");
    setTezos(tezosTK);
  };

  return (
    <div className="buttons">
      <button className="button" onClick={disconnectWallet}>
        <i className="fas fa-times"></i>&nbsp; Disconnect wallet
      </button>
    </div>
  );
};

export default DisconnectButton;
