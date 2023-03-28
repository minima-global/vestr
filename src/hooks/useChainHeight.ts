import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { events } from "../minima/libs/events";

interface Block {
  block: string;
  hash: string;
  timemilli: string;
  date: string;
}
const useChainHeight = (): Block | undefined => {
  const [tip, setTip] = useState<Block | undefined>(undefined);

  events.onNewBlock(() => {
    MDS.cmd("block", (res) => {
      setTip(res.response);
    });
  });

  useEffect(() => {
    MDS.cmd("block", (res) => {
      setTip(res.response);
    });
  }, []);

  return tip;
};

export default useChainHeight;
