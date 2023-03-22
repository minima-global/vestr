import { Box, Stack, Toolbar } from "@mui/material";
import styles from "./Home.module.css";
import * as contracts from "../../minima/libs/contracts";

const Home = () => {
  return (
    <Stack className={styles["home"]}>
      <Toolbar />
      <h5>Welcome to Vestr</h5>
      <p>
        This app allows us to create, track and calculate vesting contracts. You
        can find the smart contract below:
      </p>

      <Box className={styles["contract"]}>
        <pre>{contracts.vestingContract.script}</pre>
      </Box>
    </Stack>
  );
};

export default Home;
