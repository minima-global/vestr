import { Box, Stack, Toolbar } from "@mui/material";
import styles from "./Home.module.css";
import * as contracts from "../../minima/libs/contracts";
import VestCalculateSchedules from "../VestCalculateSchedules";

const Home = () => {
  return (
    <Stack className={styles["home"]}>
      <Toolbar />
      <h5>Welcome to Vestr</h5>
      <p>
        Vestr is a vesting scheduler. You can calculate, create and track
        relevant vesting contracts on the network.
      </p>

      <h6>Tutorial</h6>
      <p>Let's calculate a vesting schedule for a potential client.</p>

      <p>
        Let's create a schedule by locking up 1,000,000 Minima coins with an
        initial unlock of 5% and allow our client to collect once a month for 36
        months.
      </p>
      <p>
        Press the Calculate button in the form below to get an overview of the
        Vesting Schedule:
      </p>

      <VestCalculateSchedules
        totalLaunchPercentage="5"
        totalLockedAmount="1000000"
        totalPeriod="36"
      />

      <p>
        The schedule is calculated and derived from the smart contract stated
        below:
      </p>

      <Box className={styles["contract"]}>
        <pre>{contracts.vestingContract.script}</pre>
      </Box>
    </Stack>
  );
};

export default Home;
