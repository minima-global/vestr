import React from "react";
import logo from "./logo.svg";
import "./App.css";
import VestCreate from "./components/VestCreate";
import { events } from "./minima/libs/events";

function App() {
  events.onInit(() => {});

  return (
    <div className="App">
      <VestCreate />
    </div>
  );
}

export default App;
