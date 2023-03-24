import { useEffect } from "react";

import { RouterProvider } from "react-router-dom";
import "./App.css";
import { events } from "./minima/libs/events";
import router from "./router";

function App() {
  useEffect(() => {
    events.onInit(() => {});
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
