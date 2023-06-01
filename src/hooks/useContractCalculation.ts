import { useEffect, useState } from "react";
import * as RPC from "../minima/libs/RPC";
import { vestingContract } from "../minima/libs/contracts";
import { Coin } from "../@types";
import useChainHeight from "./useChainHeight";

const useContractCalculation = (coin: Coin | null) => {
  const [calculatedData, setCalculatedData] = useState(null);
  const tip = useChainHeight();

  useEffect(() => {
    if (coin) {
      RPC.runScript(
        vestingContract.checkMaths,
        {
          1: MDS.util.getStateVariable(coin, 1),
          2: MDS.util.getStateVariable(coin, 2),
          3: MDS.util.getStateVariable(coin, 3),
          4: MDS.util.getStateVariable(coin, 4),
          5: MDS.util.getStateVariable(coin, 5),
        },
        {
          "@AMOUNT": coin.tokenid === "0x00" ? coin.amount : coin.tokenamount,
          "@BLOCK": tip ? tip.block : "0",
          "@COINAGE": coin.created,
        }
      ).then((vars: any) => {
        setCalculatedData(vars);
      });
    }
  }, [coin, tip]);

  return calculatedData;
};

export default useContractCalculation;
