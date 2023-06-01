import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { events } from "../minima/libs/events";

interface Block {
  block: string;
  hash: string;
  timemilli: string;
  date: string;
}
const useChainHeight = (): Block | null => {
  const [tip, setTip] = useState<Block | null>(null);

  useEffect(() => {
    events.onNewBlock(() => {
      MDS.cmd("block", (res) => {
        setTip(res.response);
      });
    });

    MDS.cmd("block", (res) => {
      setTip(res.response);
    });
  }, []);

  return tip;
};

export default useChainHeight;
