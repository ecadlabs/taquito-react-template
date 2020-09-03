import React, { useState } from "react";
import { TezosToolkit, WalletContract } from "@taquito/taquito";

type UpdateContractProps = {
  contract: WalletContract | undefined;
  setUserBalance: (balance: any) => any;
  Tezos: TezosToolkit;
  userAddress: string | null;
  setStorage: (storage: any) => any;
};

const UpdateContract: React.FC<UpdateContractProps> = ({
  contract,
  setUserBalance,
  Tezos,
  userAddress,
  setStorage
}) => {
  const [loadingIncrement, setLoadingIncrement] = useState(false);
  const [loadingDecrement, setLoadingDecrement] = useState(false);

  if (contract && userAddress) {
    const increment = async () => {
      setLoadingIncrement(true);
      try {
        const op = await contract.methods.increment(1).send();
        await op.confirmation();
        const newStorage: any = await contract.storage();
        if (newStorage) setStorage(newStorage.toNumber());
        setUserBalance(await Tezos.tz.getBalance(userAddress));
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingIncrement(false);
      }
    };

    const decrement = async () => {
      setLoadingDecrement(true);
      try {
        const op = await contract.methods.decrement(1).send();
        await op.confirmation();
        const newStorage: any = await contract.storage();
        if (newStorage) setStorage(newStorage.toNumber());
        setUserBalance(await Tezos.tz.getBalance(userAddress));
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingDecrement(false);
      }
    };

    return (
      <div className="buttons">
        <button
          className="button"
          disabled={loadingIncrement}
          onClick={increment}
        >
          {loadingIncrement ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
            </span>
          ) : (
            <span>
              <i className="fas fa-plus"></i>&nbsp; Increment by 1
            </span>
          )}
        </button>
        <button className="button" onClick={decrement}>
          {loadingDecrement ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i>&nbsp; Please wait
            </span>
          ) : (
            <span>
              <i className="fas fa-minus"></i>&nbsp; Decrement by 1
            </span>
          )}
        </button>
      </div>
    );
  } else {
    return <div>&nbsp;</div>;
  }
};

export default UpdateContract;
