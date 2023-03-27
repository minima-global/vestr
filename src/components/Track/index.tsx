import { useState, useEffect } from "react";
import { Stack, Toolbar } from "@mui/material";
import * as RPC from "../../minima/libs/RPC";
import styles from "./Track.module.css";
import { vestingContract } from "../../minima/libs/contracts";
import { Coin } from "../../@types";

const Track = () => {
  const [contracts, setContracts] = useState<Coin[]>([]);

  useEffect(() => {
    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((data) => {
        setContracts(data.relevantCoins);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Stack className={styles["track"]}>
      <Toolbar /> <h5>Your Vesting Contracts</h5>
      <Stack>Tracking..</Stack>
    </Stack>
  );
};

export default Track;
