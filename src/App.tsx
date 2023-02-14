import React from "react";
import logo from "./logo.svg";
import "./App.css";
import VestCreate from "./components/VestCreate";
import { events } from "./minima/libs/events";

import * as RPC from "./minima/libs/RPC";
import { vestingContract } from "./minima/libs/contracts";
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
