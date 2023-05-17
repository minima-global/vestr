import { useEffect, useState } from "react";

import { RouterProvider } from "react-router-dom";
import "./App.css";
import { vestingContract } from "./minima/libs/contracts";
import { events } from "./minima/libs/events";
import router from "./router";

import * as RPC from "./minima/libs/RPC";
import { CircularProgress } from "@mui/material";

function App() {
  const [_minimastatus, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    events.onInit(async () => {
      MDS.cmd("balance", (r) => {
        if (r.status) {
          setLoading(false);
          setStatus(true);
        }
      });

      await RPC.setNewScript(vestingContract.script);
    });
    if (loading && _minimastatus) {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [loading, _minimastatus]);

  return (
    <>
      {!!_minimastatus && !loading && <RouterProvider router={router} />}
      {!_minimastatus && !loading && (
        <div className="offline__wrapper">
          <div />
          <div>
            <img alt="offline" src="./assets/failed.svg" />
            <h6>Minima is offline</h6>
            <p>Check the status of your node and refresh this page.</p>
          </div>
          <div />
        </div>
      )}
      {!_minimastatus && loading && (
        <div className="offline__wrapper">
          <div />
          <div>
            <CircularProgress
              sx={{ color: "white", alignSelf: "center" }}
              size={32}
            />
          </div>
          <div />
        </div>
      )}
    </>
  );
}

export default App;
