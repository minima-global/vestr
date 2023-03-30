import { useEffect } from "react";

import { RouterProvider } from "react-router-dom";
import "./App.css";
import { vestingContract } from "./minima/libs/contracts";
import { events } from "./minima/libs/events";
import router from "./router";

import * as RPC from "./minima/libs/RPC";

function App() {
  useEffect(() => {
    events.onInit(async () => {
      await RPC.setNewScript(vestingContract.script);
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
