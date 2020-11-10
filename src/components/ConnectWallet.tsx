import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { LedgerSigner } from "@taquito/ledger-signer";

type ButtonProps = {
  Tezos: TezosToolkit;
  setContract: (instance: any) => any;
  setPublicToken: (token: any) => any;
  setWallet: (wallet: any) => any;
  setUserAddress: (address: any) => any;
  setUserBalance: (balance: any) => any;
  setStorage: (storage: any) => any;
  contractAddress: string;
  BeaconConnection: { [p: string]: string };
  setBeaconConnection: (conn: any) => any;
};

const ConnectButton: React.FC<ButtonProps> = ({
  Tezos,
  setContract,
  setPublicToken,
  setWallet,
  setUserAddress,
  setUserBalance,
  setStorage,
  contractAddress,
  BeaconConnection,
  setBeaconConnection,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingNano, setLoadingNano] = useState(false);

  const setup = async (userAddress: string): Promise<void> => {
    setUserAddress(userAddress);
    // updates balance
    const balance = await Tezos.tz.getBalance(userAddress);
    setUserBalance(balance.toNumber());
    // creates contract instance
    const contract = await Tezos.wallet.at(contractAddress);
    const storage: any = await contract.storage();
    setContract(contract);
    setStorage(storage.toNumber());
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const wallet = new BeaconWallet({
        name: "Taquito Boilerplate",
        eventHandlers: {
          P2P_LISTEN_FOR_CHANNEL_OPEN: {
            handler: async (data) => {
              console.log("Listening to P2P channel:", data);
              setBeaconConnection(BeaconConnection.LISTENING);
              setPublicToken(data.publicKey);
            },
          },
          P2P_CHANNEL_CONNECT_SUCCESS: {
            handler: async (data) => {
              console.log("Channel connected:", data);
              setBeaconConnection(BeaconConnection.CONNECTED);
            },
          },
          PERMISSION_REQUEST_SENT: {
            handler: async (data) => {
              console.log("Permission request sent:", data);
              setBeaconConnection(BeaconConnection.PERMISSION_REQUEST_SENT);
            },
          },
          PERMISSION_REQUEST_SUCCESS: {
            handler: async (data) => {
              console.log("Wallet is connected:", data);
              setBeaconConnection(BeaconConnection.PERMISSION_REQUEST_SUCCESS);
            },
          },
        },
      });
      Tezos.setWalletProvider(wallet);
      await wallet.requestPermissions({
        network: {
          type: NetworkType.CARTHAGENET,
          rpcUrl: "https://api.tez.ie/rpc/carthagenet",
        },
      });
      setWallet(wallet);
      // gets user's address
      const userAddress = await wallet.getPKH();
      await setup(userAddress);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const connectNano = async () => {
    try {
      setLoadingNano(true);
      const transport = await TransportU2F.create();
      const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'", true);

      Tezos.setSignerProvider(ledgerSigner);

      //Get the public key and the public key hash from the Ledger
      const userAddress = await Tezos.signer.publicKeyHash();
      await setup(userAddress);
    } catch (error) {
      console.log("Error!", error);
      setLoadingNano(false);
    }
  };

  return (
    <div className="buttons">
      <button className="button" disabled={loading || loadingNano} onClick={connectWallet}>
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Loading, please wait
          </span>
        ) : (
          <span>
            <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
          </span>
        )}
      </button>
      <button className="button" disabled={loading || loadingNano} onClick={connectNano}>
        {loadingNano ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Loading, please wait
          </span>
        ) : (
          <span>
            <i className="fab fa-usb"></i>&nbsp; Connect with Ledger Nano
          </span>
        )}
      </button>
    </div>
  );
};

export default ConnectButton;
