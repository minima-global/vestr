import { Stack, Toolbar } from "@mui/material";
import styles from "./Drawer.module.css";
import {
  NoteAddOutlined,
  CalculateOutlined,
  HomeOutlined,
  LocationSearchingOutlined,
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";

const Drawer = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["drawer"]}>
      <Toolbar className={styles["toolbar"]}>
        <Stack
          rowGap={0.1}
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <img src="/assets/icon.png" />
          <h6>Vestr</h6>
        </Stack>
      </Toolbar>
      <Stack mt={2} gap={2}>
        <Stack className={styles["navigation"]} ml={3} mr={3} gap={2}>
          <NavLink
            className={({ isActive, isPending }) =>
              isPending
                ? styles["pending"]
                : isActive
                ? styles["active"]
                : styles[""]
            }
            to="/dashboard/home"
          >
            <HomeOutlined />
            Home
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) =>
              isPending
                ? styles["pending"]
                : isActive
                ? styles["active"]
                : styles[""]
            }
            to="/dashboard/calculate"
          >
            <CalculateOutlined />
            Calculate
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) =>
              isPending
                ? styles["pending"]
                : isActive
                ? styles["active"]
                : styles[""]
            }
            to="/dashboard/create"
          >
            <NoteAddOutlined />
            Create
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) =>
              isPending
                ? styles["pending"]
                : isActive
                ? styles["active"]
                : styles[""]
            }
            to="/dashboard/track"
          >
            <LocationSearchingOutlined />
            Track
          </NavLink>
        </Stack>
      </Stack>
    </div>
  );
};

export default Drawer;
