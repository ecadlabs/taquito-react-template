import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { LedgerSigner } from "@taquito/ledger-signer";

type ButtonProps = {
  Tezos: TezosToolkit;
  setContract: Dispatch<SetStateAction<any>>;
  setWallet: Dispatch<SetStateAction<any>>;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  setStorage: Dispatch<SetStateAction<number>>;
  contractAddress: string;
  setBeaconConnection: Dispatch<SetStateAction<boolean>>;
  setPublicToken: Dispatch<SetStateAction<string | null>>;
  wallet: BeaconWallet;
};

const ConnectButton = ({
  Tezos,
  setContract,
  setWallet,
  setUserAddress,
  setUserBalance,
  setStorage,
  contractAddress,
  setBeaconConnection,
  setPublicToken,
  wallet
}: ButtonProps): JSX.Element => {
  const [loadingNano, setLoadingNano] = useState<boolean>(false);

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

  const connectWallet = async (): Promise<void> => {
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.HANGZHOUNET,
          rpcUrl: "https://hangzhounet.api.tez.ie"
        }
      });
      // gets user's address
      const userAddress = await wallet.getPKH();
      await setup(userAddress);
      setBeaconConnection(true);
    } catch (error) {
      console.log(error);
    }
  };

  const connectNano = async (): Promise<void> => {
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

  useEffect(() => {
    (async () => {
      // creates a wallet instance
      const wallet = new BeaconWallet({
        name: "Taquito Boilerplate",
        preferredNetwork: NetworkType.HANGZHOUNET,
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: data => setPublicToken(data.publicKey)
          }
        }
      });
      Tezos.setWalletProvider(wallet);
      setWallet(wallet);
      // checks if wallet was connected before
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const userAddress = await wallet.getPKH();
        await setup(userAddress);
        setBeaconConnection(true);
      }
    })();
  }, []);

  return (
    <div className="buttons">
      <button className="button" onClick={connectWallet}>
        <span>
          <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
        </span>
      </button>
      <button className="button" disabled={loadingNano} onClick={connectNano}>
        {loadingNano ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Loading, please
            wait
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
