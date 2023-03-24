import { Stack, Toolbar } from "@mui/material";
import VestCreate from "../VestCreate";
import styles from "./Create.module.css";
const Create = () => {
  return (
    <Stack mb={2}>
      <Toolbar />
      <Stack className={styles["create"]} spacing={2}>
        <h5>Create A Vesting Contract</h5>
        <VestCreate />
      </Stack>
    </Stack>
  );
};

export default Create;
