import { createContext, useEffect, useRef, useState } from "react";
import * as RPC from "./minima/libs/RPC";
import { vestingContract } from "./minima/libs/contracts";
import { events } from "./minima/libs/events";

import { Coin, MinimaToken } from "./@types";

export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);
  const [contracts, setContracts] = useState<Map<string, Coin>>(new Map());
  const [scriptAddress, setScriptAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState<MinimaToken[]>([]);

  console.log("INIT ScriptAddress", scriptAddress);
  const getBalance = async () => {
    await RPC.getMinimaBalance().then((b) => {
      setWalletBalance(b);
    });
  };

  const addScriptGetContracts = async () => {
    await RPC.setNewScript(vestingContract.cleanScript).then((a) => {
      console.log("Setting new script..", a);
      setScriptAddress(a);

      RPC.getCoinsByAddress(a).then((d) => {
        const map = new Map();
        d.relevantCoins.map((c) =>
          map.set(MDS.util.getStateVariable(c, 199), c)
        );
        console.log("gotCoinsByAddress", map);

        setContracts(map);
      });
    });
  };

  const getContracts = async (address: string) => {
    console.log(`Getting contracts w/ scriptAddress: ${address}`);
    RPC.getCoinsByAddress(address).then((d) => {
      const map = new Map();

      d.relevantCoins.map((c) => map.set(MDS.util.getStateVariable(c, 199), c));

      setContracts(map);
    });
  };

  useEffect(() => {
    events.onInit(() => {
      console.log("ON INIT TRUE");
      addScriptGetContracts();

      getBalance();
    });
    events.onNewBalance(() => {
      getBalance();

      addScriptGetContracts();
    });

    events.onFail(() => {
      console.error("MDS Unavailable!");
    });
  }, [loaded]);

  return (
    <appContext.Provider
      value={{ scriptAddress, contracts, walletBalance, getContracts }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
