import { Stack, Toolbar } from "@mui/material";
import VestCalculateSchedules from "../VestCalculateSchedules";
import styles from "./Calculate.module.css";

const Calculate = () => {
  return (
    <Stack pb={2}>
      <Toolbar />
      <Stack spacing={2} className={styles["calculate"]}>
        <h5>Vesting Calculator</h5>
        <VestCalculateSchedules />
      </Stack>
    </Stack>
  );
};

export default Calculate;
