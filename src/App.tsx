import { Outlet } from "react-router-dom";
import AppProvider from "./AppContext";

const App = () => {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
};

export default App;
