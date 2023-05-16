import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import Root from "../components/Root";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import Home from "../components/Home";
import Calculate from "../components/Calculate";
import Create from "../components/Create";
import Track from "../components/Track";
import Details from "../components/Details";

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="calculate" element={<Calculate />} />
        <Route path="createnew" element={<Create />} />
        <Route path="track" element={<Track />}>
          <Route path=":id" element={<Details />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate replace to="dashboard" />} />
    </Route>
  )
);

export default router;
