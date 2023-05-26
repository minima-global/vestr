import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import theme from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import {
  Route,
  createRoutesFromElements,
  createHashRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home";
import Calculate from "./components/Calculate";
import Details from "./components/Details";
import Dashboard from "./pages/dashboard";
import NotFound from "./components/NotFound";
import Track from "./components/Track";
import SplashPage from "./pages/splash";
import Info from "./pages/info";
import Creator from "./pages/creator";
import Create from "./pages/create";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<SplashPage />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="about" element={<Info />} />
        <Route path="creator" element={<Creator />}>
          <Route path="create" element={<Create />} />
        </Route>
        <Route path="createnew/:id" element={<Create />} />
        <Route path="track" element={<Track />}>
          <Route path=":id" element={<Details />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate replace to="dashboard" />} />
    </Route>
  )
);
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
