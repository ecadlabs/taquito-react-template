import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";

const Transfers: React.FC<{ Tezos: TezosToolkit }> = ({ Tezos }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const sendTransfer = async () => {
    if (recipient && amount) {
      setLoading(true);
      try {
        const op = await Tezos.wallet.transfer({ to: recipient, amount: parseInt(amount) }).send();
        await op.confirmation();
        setRecipient("");
        setAmount("");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="transfer-inputs">
      <input type="text" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button className="button" disabled={!recipient && !amount} onClick={sendTransfer}>
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
          </span>
        ) : (
          <span>
            <i className="far fa-paper-plane"></i>&nbsp; Send
          </span>
        )}
      </button>
    </div>
  );
};

export default Transfers;
