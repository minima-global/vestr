import { useEffect, useState } from "react";
import * as RPC from "../minima/libs/RPC";
import { events } from "../minima/libs/events";
import { vestingContract } from "../minima/libs/contracts";
import { Coin } from "../@types";

const useVestingContracts = () => {
  const [contracts, setContracts] = useState<Map<string, Coin>>(new Map());

  useEffect(() => {
    events.onNewBalance(() =>
      RPC.getCoinsByAddress(vestingContract.scriptaddress).then((d) => {
        const map = new Map();

        d.relevantCoins.map((c) =>
          map.set(MDS.util.getStateVariable(c, 199), c)
        );

        setContracts(map);
      })
    );

    RPC.getCoinsByAddress(vestingContract.scriptaddress).then((d) => {
      const map = new Map();

      d.relevantCoins.map((c) => map.set(MDS.util.getStateVariable(c, 199), c));

      setContracts(map);
    });
  }, []);

  return contracts;
};

export default useVestingContracts;
