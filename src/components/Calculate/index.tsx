import { Stack, Toolbar } from "@mui/material";
import VestCalculateSchedules from "../VestCalculateSchedules";
import styles from "./Calculate.module.css";
import { useDrawer } from "../Dashboard";

const Calculate = () => {
  const toggle = useDrawer();

  return (
    <section className={styles["calculate"]}>
      <Toolbar className={styles["toolbar"]}>
        <img onClick={toggle} id="home" src="./assets/menu.svg" />

        <div />
      </Toolbar>
      <Stack spacing={2}>
        <h5>Vesting Calculator</h5>
        <VestCalculateSchedules />
      </Stack>
    </section>
  );
};

export default Calculate;
