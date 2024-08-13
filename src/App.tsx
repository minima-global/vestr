import { Outlet } from "react-router-dom";
import AppProvider from "./AppContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Unavailable from "./components/Unavailable";

const App = () => {
  return (
    <AppProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Unavailable />

        <Outlet />
      </LocalizationProvider>
    </AppProvider>
  );
};

export default App;
