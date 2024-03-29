import { createContext, useEffect, useRef, useState } from "react";
import * as RPC from "./minima/libs/RPC";
import { vestingContract } from "./minima/libs/contracts";
import { events } from "./minima/libs/events";

import { Coin, MinimaToken } from "./@types";
import useFirstVisit from "./hooks/useFirstVisit";
import { makeTokenImage } from "./utils/utils";

var balanceInterval: ReturnType<typeof setInterval>;
export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);
  const [contracts, setContracts] = useState<Map<string, Coin>>(new Map());
  const [scriptAddress, setScriptAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState<MinimaToken[]>([]);
  const [vaultLocked, setVaultLocked] = useState(false);
  const [tip, setTip] = useState(null);
  const firstVisit = useFirstVisit();

  const getBalance = async () => {
    const tokens = await RPC.getTokens();
    await RPC.getMinimaBalance().then((b) => {
      b.map((t) => {
        if (t.token.url && t.token.url.startsWith("<artimage>", 0)) {
          t.token.url = makeTokenImage(t.token.url, t.tokenid);
        }
      });

      const walletNeedsUpdating = !!b.find((t) => t.unconfirmed !== "0");

      if (!walletNeedsUpdating) {
        window.clearInterval(balanceInterval);
      }

      if (walletNeedsUpdating) {
        setWalletBalance(b);
        if (!balanceInterval) {
          balanceInterval = setInterval(() => {
            getBalance();
          }, 10000);
        }
      }

      const filterNonFungible = tokens.filter((t) => t.decimals === 0);
      const balanceWithoutNFT = b.filter(
        (t) => !filterNonFungible.some((f) => f.tokenid === t.tokenid)
      );

      setWalletBalance(balanceWithoutNFT);
    });
  };

  const isVaultLocked = async () => {
    await RPC.isVaultLocked().then((l) => {
      setVaultLocked(l);
    });
  };

  const addScriptGetContracts = async () => {
    await RPC.setNewScript(vestingContract.cleanScript).then((a) => {
      setScriptAddress(a);

      RPC.getCoinsByAddress(a).then((d) => {
        const map = new Map();
        d.relevantCoins.map((c) =>
          map.set(MDS.util.getStateVariable(c, 199), c)
        );

        setContracts(map);
      });
    });
  };

  const getContracts = async (address: string) => {
    RPC.getCoinsByAddress(address).then((d) => {
      const map = new Map();

      d.relevantCoins.map((c) => map.set(MDS.util.getStateVariable(c, 199), c));

      setContracts(map);
    });
  };

  const getTip = () => {
    (window as any).MDS.cmd("block", (resp: any) => {
      if (resp.status) {
        setTip(resp.response.block);
      }
    });
  };

  useEffect(() => {
    events.onNewBlock(() => {});

    events.onInit(() => {
      addScriptGetContracts();

      getBalance();

      isVaultLocked();

      getTip();
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
      value={{
        scriptAddress,
        contracts,
        walletBalance,
        getContracts,
        vaultLocked,
        firstVisit,

        tip,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
