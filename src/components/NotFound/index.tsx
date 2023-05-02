import { Stack, Toolbar } from "@mui/material";
import styles from "./NotFound.module.css";
import { useDrawer } from "../Dashboard";

const NotFound = () => {
  const toggle = useDrawer();

  return (
    <Stack className={styles["notfound"]}>
      <Toolbar className={styles["toolbar"]}>
        <img onClick={toggle} id="home" src="./assets/menu.svg" />

        <div />
      </Toolbar>
      <Stack className={styles["content"]}>
        <h6>Page Not Found</h6>
      </Stack>
    </Stack>
  );
};

export default NotFound;
