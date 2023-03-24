import { useState } from "react";
import { Box } from "@mui/material";
import Drawer from "../Drawer";
import styles from "./Dashboard.module.css";
import Content from "../Content";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [mobile, setMobile] = useState(false);
  return (
    <Box className={styles["app-wrapper"]}>
      <Drawer />
      <Content>
        <Outlet />
      </Content>
    </Box>
  );
};

export default Dashboard;
