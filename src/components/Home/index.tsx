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
        Vestr is a vesting scheduler. Vesting is the process of locking up
        Minima coins or custom tokens and distributing them within a given
        timeframe.
        <br />
        You can calculate, create and track relevant vesting contracts on the
        network.
      </p>

      <p>
        <b>Cliff periods</b> in vesting contracts are a minimum time required
        before the contracts starts.
      </p>
      <p>
        <b>Grace periods</b> in vesting contracts are minimum time required
        between each collection.
      </p>

      <h6>Tutorial</h6>
      <p>
        Let's calculate a vesting schedule for a potential client as an example.
        Say we want to issue a contract of 1,000,000 Minima coins, with an
        initial lock up of 5% of the total amount and a monthly collection for a
        period 36 months.
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
