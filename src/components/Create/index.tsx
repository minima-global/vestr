import { Stack, Toolbar } from "@mui/material";
import VestCreate from "../VestCreate";
import styles from "./Create.module.css";
import { useDrawer } from "../Dashboard";
const Create = () => {
  const toggle = useDrawer();
  return (
    <section className={styles["create"]}>
      <Toolbar className={styles["toolbar"]}>
        <img onClick={toggle} id="home" src="./assets/menu.svg" />

        <div />
      </Toolbar>
      <Stack spacing={2}>
        <h5>Create A Vesting Contract</h5>
        <VestCreate />
      </Stack>
    </section>
  );
};

export default Create;
