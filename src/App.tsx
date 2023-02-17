import "./App.css";
import VestCreate from "./components/VestCreate";
import { events } from "./minima/libs/events";

import * as RPC from "./minima/libs/RPC";
import { vestingContract } from "./minima/libs/contracts";
import Decimal from "decimal.js";

Decimal.set({ precision: 64 });
function App() {
  events.onInit(async () => {
    // set the vesting contract script
    await RPC.setNewScript(vestingContract.script);
  });

  return (
    <div className="App">
      <VestCreate />
    </div>
  );
}

export default App;
