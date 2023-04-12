import { useState } from "react";
import { Box } from "@mui/material";
import Drawer from "../Drawer";
import styles from "./Dashboard.module.css";
import Content from "../Content";
import { Outlet, useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const [drawerOpen, setOpen] = useState(false);

  const drawerToggleHandler = () => {
    setOpen((prevCheck) => !prevCheck);
  };

  return (
    <Box className={styles["app-wrapper"]}>
      <Drawer closeDrawer={() => setOpen(false)} open={drawerOpen} />
      <Content>
        <Outlet context={drawerToggleHandler} />
      </Content>
    </Box>
  );
};

type ContextType = () => void;
export function useDrawer() {
  return useOutletContext<ContextType>();
}

export default Dashboard;
