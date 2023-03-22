import { Stack, Toolbar } from "@mui/material";
import styles from "./Drawer.module.css";
import {
  NoteAddOutlined,
  CalculateOutlined,
  HomeOutlined,
  LocationSearchingOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
          <img src="./assets/icon.png" />
          <h6>Vestr</h6>
        </Stack>
      </Toolbar>
      <Stack mt={2} gap={2}>
        <Stack className={styles["navigation"]} ml={3} mr={3} gap={2}>
          <a onClick={() => navigate("/dashboard/home")}>
            <HomeOutlined />
            Home
          </a>
          <a onClick={() => navigate("/dashboard/calculate")}>
            <CalculateOutlined />
            Calculate
          </a>
          <a onClick={() => navigate("/dashboard/create")}>
            <NoteAddOutlined />
            Create
          </a>
          <a onClick={() => navigate("/dashboard/track")}>
            <LocationSearchingOutlined />
            Track
          </a>
        </Stack>
      </Stack>
    </div>
  );
};

export default Drawer;
