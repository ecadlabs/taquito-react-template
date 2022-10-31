import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "../App.css";
import ConnectButton from "../components/ConnectWallet";
import DisconnectButton from "../components/DisconnectWallet";
import qrcode from "qrcode-generator";
import UpdateContract from "../components/UpdateContract";
import Transfers from "../components/Transfers";

enum BeaconConnection {
  NONE = "",
  LISTENING = "Listening to P2P channel",
  CONNECTED = "Channel connected",
  PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
  PERMISSION_REQUEST_SUCCESS = "Wallet is connected",
}

export default function Header() {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.ecadinfra.com")
  );
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>("");
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [storage, setStorage] = useState<number>(0);
  const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("transfer");

  // Ghostnet Increment/Decrement contract
  const contractAddress: string = "KT1QMGSLynvwwSfGbaiJ8gzWHibTCweCGcu8";

  const generateQrCode = (): { __html: string } => {
    const qr = qrcode(0, "L");
    qr.addData(publicToken || "");
    qr.make();

    return { __html: qr.createImgTag(4) };
  };

  if (publicToken && (!userAddress || isNaN(userBalance))) {
    return (
      <>
        <div className="dialog-container">
          <div className="dialog">
            <div id="content">
              <p className="text-align-center">
                <i className="fas fa-broadcast-tower"></i>&nbsp; Connecting to
                your wallet
              </p>
              <div
                dangerouslySetInnerHTML={generateQrCode()}
                className="text-align-center"
              ></div>
              <p id="public-token">
                {copiedPublicToken ? (
                  <span id="public-token-copy__copied">
                    <i className="far fa-thumbs-up"></i>
                  </span>
                ) : (
                  <span
                    id="public-token-copy"
                    onClick={() => {
                      if (publicToken) {
                        navigator.clipboard.writeText(publicToken);
                        setCopiedPublicToken(true);
                        setTimeout(() => setCopiedPublicToken(false), 2000);
                      }
                    }}
                  >
                    <i className="far fa-copy"></i>
                  </span>
                )}

                <span>
                  Public token: <span>{publicToken}</span>
                </span>
              </p>
              <p className="text-align-center">
                Status: {beaconConnection ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  } else if (userAddress && !isNaN(userBalance)) {
    return (
      <>
        <div className="title">
          <h1>NFT Art Map</h1>
          <DisconnectButton
            wallet={wallet}
            setPublicToken={setPublicToken}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setWallet={setWallet}
            setTezos={setTezos}
            setBeaconConnection={setBeaconConnection}
          />
        </div>
        <div className="dialog-container">
          <div className="dialog">
            <div id="tabs">
              <div
                id="transfer"
                className={activeTab === "transfer" ? "active" : ""}
                onClick={() => setActiveTab("transfer")}
              >
                Make a transfer
              </div>
              <div
                id="contract"
                className={activeTab === "contract" ? "active" : ""}
                onClick={() => setActiveTab("contract")}
              >
                Interact with a contract
              </div>
            </div>
            <div id="content">
              {activeTab === "transfer" ? (
                <div id="transfers">
                  <h3 className="text-align-center">Make a transfer</h3>
                  <Transfers
                    Tezos={Tezos}
                    setUserBalance={setUserBalance}
                    userAddress={userAddress}
                  />
                </div>
              ) : (
                <div id="increment-decrement">
                  <h3 className="text-align-center">
                    Current counter: <span>{storage}</span>
                  </h3>
                  <UpdateContract
                    contract={contract}
                    setUserBalance={setUserBalance}
                    Tezos={Tezos}
                    userAddress={userAddress}
                    setStorage={setStorage}
                  />
                </div>
              )}
              <p>
                <i className="far fa-file-code"></i>&nbsp;
                <a
                  href={`https://better-call.dev/ghostnet/${contractAddress}/operations`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contractAddress}
                </a>
              </p>
              <p>
                <i className="far fa-address-card"></i>&nbsp; {userAddress}
              </p>
              <p>
                <i className="fas fa-piggy-bank"></i>&nbsp;
                {(userBalance / 1000000).toLocaleString("en-US")} ꜩ
              </p>
            </div>
          </div>
        </div>
      </>
    );
  } else if (!publicToken && !userAddress && !userBalance) {
    return (
      <>
        <div className="title">
          <h1>NFT Art Map</h1>
          <ConnectButton
            Tezos={Tezos}
            setContract={setContract}
            setPublicToken={setPublicToken}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setStorage={setStorage}
            contractAddress={contractAddress}
            setBeaconConnection={setBeaconConnection}
            wallet={wallet}
          />
        </div>
      </>
    );
  } else {
    return <div>An error has occurred</div>;
  }
}
