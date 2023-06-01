import { useEffect, useState } from "react";
import { events } from "./minima/libs/events";
import useMinima from "./hooks/useMinima";
import { Outlet } from "react-router-dom";

import * as RPC from "./minima/libs/RPC";
import { vestingContract } from "./minima/libs/contracts";

const App = () => {
  const status = useMinima();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const addScript = async () => {
    await RPC.setNewScript(vestingContract.cleanScript);
  };
  useEffect(() => {
    events.onFail(() => {
      console.error("MDS Unavailable!");
      setError(true);
    });

    addScript();

    return () => {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };
  }, [status]);

  const isReady = !error && status && !loading;
  const isLoading = loading;
  const isNotAvailable = error || (!status && !loading);

  return <Outlet />;
};

export default App;
