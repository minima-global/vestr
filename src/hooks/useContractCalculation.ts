import { useContext, useEffect, useState } from "react";
import * as RPC from "../minima/libs/RPC";
import { vestingContract } from "../minima/libs/contracts";
import { appContext } from "../AppContext";

const useContractCalculation = (id?: string) => {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(true);  
  const [contract, setContract] = useState<any>(null);
  const [calculatedData, setCalculatedData] = useState(null);
  const { contracts, tip } = useContext(appContext);

  useEffect(() => {
    if (!contracts) return;

    // Start loading
    setLoading(true);
    setNotFound(false);

    // Early return if id is not provided
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Fetch contract using the provided id
    const coin = contracts.get(id);
    if (!coin) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    
    setContract(coin);

    // Calculate data using RPC
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
        "@BLOCK": tip,
        "@COINAGE": coin.created,
      }
    )
    .then((vars: any) => {
      setCalculatedData(vars);
    })
    .catch((error) => {
      console.error("Error calculating contract data:", error);
    })
    .finally(() => {
      setLoading(false);
    });

  }, [id, tip, contracts]);

  return {
    contract,
    calculatedData,
    loading,
    notFound,
  };
};

export default useContractCalculation;
