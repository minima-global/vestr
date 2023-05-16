import { useEffect, useState } from "react";
import { MinimaToken } from "../@types";
import * as RPC from "../minima/libs/RPC";
import { makeTokenImage } from "../utils/utils";
import { events } from "../minima/libs/events";

const useWalletBalance = () => {
  const [balance, setBalance] = useState<MinimaToken[]>([]);
  const [loadingBalance, setLoading] = useState(true);
  const [error, setError] = useState<false | string>(false);

  useEffect(() => {
    events.onNewBalance(() => {
      RPC.getMinimaBalance()
        .then((balance) => {
          const b = balance.map((t: MinimaToken) => {
            if (t.token.url && t.token.url.startsWith("<artimage>", 0)) {
              t.token.url = makeTokenImage(t.token.url, t.tokenid);
            }
            return t;
          });

          setBalance(b);
        })
        .catch((err) => {
          setError(err);
          console.error(err);
        });
    });
    RPC.getMinimaBalance()
      .then((balance) => {
        const b = balance.map((t: MinimaToken) => {
          if (t.token.url && t.token.url.startsWith("<artimage>", 0)) {
            t.token.url = makeTokenImage(t.token.url, t.tokenid);
          }
          return t;
        });

        setBalance(b);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { balance, loadingBalance, error };
};

export default useWalletBalance;
