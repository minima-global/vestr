import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import Root from "../components/Root";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import Home from "../components/Home";
import VestCalculateSchedules from "../components/VestCalculateSchedules";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="home" element={<Home />} />
        <Route path="calculate" element={<VestCalculateSchedules />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate replace to="dashboard" />} />
      {/* ... etc. */}
    </Route>
  )
);

export default router;
