import { createContext, useEffect, useRef, useState } from "react";
import * as RPC from "./minima/libs/RPC";
import { vestingContract } from "./minima/libs/contracts";

import { Coin, MinimaToken } from "./@types";
import useFirstVisit from "./hooks/useFirstVisit";
import { makeTokenImage } from "./utils/utils";
import { sql } from "./minima/libs/SQL";

var balanceInterval: ReturnType<typeof setInterval>;
export const appContext = createContext({} as any);

interface IProps {
  children: any;
}
const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);

  const [unavailable, setUnavailable] = useState(false);

  const [contracts, setContracts] = useState<Map<string, Coin>>(new Map());
  const [scriptAddress, setScriptAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState<MinimaToken[]>([]);
  const [vaultLocked, setVaultLocked] = useState(false);
  const [tip, setTip] = useState(null);
  const firstVisit = useFirstVisit();

  const [_contractNicknames, setContractNicknames] = useState<Record<
    string,
    string
  > | null>(null);
  const [_promptEditNickname, setPromptEditNickName] = useState(false);

  const getBalance = async () => {
    const tokens = await RPC.getTokens();
    await RPC.getMinimaBalance()
      .then((b) => {
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
      })
      .catch((err) => {
        console.log(err);
        setUnavailable(true);
      });
  };

  const isVaultLocked = async () => {
    await RPC.isVaultLocked().then((l) => {
      setVaultLocked(l);
    });
  };

  const addScriptGetContracts = async () => {
    await RPC.setNewScript(vestingContract.cleanScript)
      .then((a) => {
        setScriptAddress(a);

        RPC.getCoinsByAddress(a).then((d) => {
          const map = new Map();
          d.relevantCoins.map((c) =>
            map.set(MDS.util.getStateVariable(c, 199), c)
          );

          setContracts(map);
        });
      })
      .catch((err) => {
        console.error(err);
        setUnavailable(true);
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
    if (!loaded.current) {
      loaded.current = true;
      (window as any).MDS.init((msg: any) => {
        if (msg.event === "inited") {
          addScriptGetContracts();

          getBalance();

          isVaultLocked();

          getTip();

          (async () => {
            await sql(
              `CREATE TABLE IF NOT EXISTS cache (name varchar(255), data longtext);`
            );

            const nicknameContracts: any = await sql(
              `SELECT * FROM cache WHERE name = 'CONTRACTS'`
            );

            if (nicknameContracts) {
              setContractNicknames(JSON.parse(nicknameContracts.DATA));
            }
          })();
        }

        if (msg.event === "NEWBALANCE") {
          getBalance();

          addScriptGetContracts();
        }

        if (msg.event === "MDSFAIL") {
          console.warn("MDS Unavailable!");
          setUnavailable(true);
        }

        if (msg.event === "NEWBLOCK") {
          // get block height
          (window as any).MDS.cmd("block", function (resp: any) {
            if (resp.status) {
              setTip(resp.response.block);
            }
          });
          // on new block?
        }
      });
    }
  }, [loaded]);

  const editNickname = async (address: string, nickname: string) => {
    const updatedNicknames = {
      ..._contractNicknames,
      [address]: nickname,
    };

    // update nicknames
    setContractNicknames(updatedNicknames);

    const nicknames = await sql(
      `SELECT * FROM cache WHERE name = 'CONTRACTS'`
    );

    if (!nicknames) {
      await sql(
        `INSERT INTO cache (name, data) VALUES ('CONTRACTS', '${JSON.stringify(
          updatedNicknames
        )}')`
      );
      setPromptEditNickName(false);
    } else {
      await sql(
        `UPDATE cache SET data = '${JSON.stringify(
          updatedNicknames
        )}' WHERE name = 'CONTRACTS'`
      );
      setPromptEditNickName(false);
    }
  };

  const promptEditNickname = () =>
    setPromptEditNickName((prevState) => !prevState);

  return (
    <appContext.Provider
      value={{
        scriptAddress,
        contracts,
        walletBalance,
        getContracts,
        vaultLocked,
        firstVisit,
        unavailable,

        tip,
        loaded,

        _contractNicknames,
        _promptEditNickname,
        editNickname,
        promptEditNickname,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
