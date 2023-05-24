import Drawer from "../Drawer";
import { useState } from "react";
import styles from "./Dashboard.module.css";
import { Outlet, useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const [drawerOpen, setOpen] = useState(false);

  const drawerToggleHandler = () => {
    setOpen((prevCheck) => !prevCheck);
  };

  return (
    <div className={styles["app-wrapper"]}>
      <nav>
        <Drawer closeDrawer={() => setOpen(false)} open={drawerOpen} />
      </nav>
      <main>
        <Outlet context={drawerToggleHandler} />
      </main>
    </div>
  );
};

type ContextType = () => void;
export function useDrawer() {
  return useOutletContext<ContextType>();
}

export default Dashboard;
