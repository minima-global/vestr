import "./App.css";
import { useState } from "react";
import VestCreate from "./components/VestCreate";
import { events } from "./minima/libs/events";

import * as RPC from "./minima/libs/RPC";
import { vestingContract } from "./minima/libs/contracts";
import Decimal from "decimal.js";
import MiError from "./components/MiCustom/MiError/MiError";
import { Stack } from "@mui/material";

Decimal.set({ precision: 64 });
function App() {
  const [minimaStatus, setMinimaStatus] = useState(false);

  events.onInit(async () => {
    // set the vesting contract script
    await RPC.setNewScript(vestingContract.script).then(() => {
      setMinimaStatus(true);
    });
  });

  return (
    <div className="App">
      {minimaStatus && <VestCreate />}
      {!minimaStatus && (
        <Stack mt={2} alignItems="center" justifyContent="center">
          <MiError>
            <label>
              Minima is offline - check node's status and refresh this page
            </label>
          </MiError>
        </Stack>
      )}
    </div>
  );
}

export default App;
