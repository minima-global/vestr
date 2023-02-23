import { useEffect, useState } from "react";

import { Stack } from "@mui/system";
import { Button, CircularProgress, Modal, TextField } from "@mui/material";
import styles from "./MiModalLayout.module.css";
import CloseIcon from "@mui/icons-material/Close";

import * as RPC from "../../../minima/libs/RPC";

import Decimal from "decimal.js";
import MiSuccessModal from "../MiSuccessModal/MiSuccessModal";
import { vestingContract } from "../../../minima/libs/contracts";

Decimal.set({ precision: 64 });
const MiRootModal = (props: any) => {
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [desiredAmount, setDesiredAmount] = useState(0);
  const { viewCoin, closeModal, setError, viewCoinScriptData, setSuccess } =
    props;

  const [loading, setLoading] = useState(false);
  // console.log("viewCoin", viewCoin);
  useEffect(() => {
    const neverWithdrew = new Decimal(viewCoin.state[1].data)
      .minus(viewCoin.amount)
      .equals(0);
    if (neverWithdrew) {
      setMaxAmount(new Decimal(viewCoin.amount).toNumber());
    }

    if (!neverWithdrew) {
      // console.log(viewCoinScriptData);
      // console.log("already colect", viewCoinScriptData.alreadycollected);
      const change = new Decimal(viewCoin.state[1].data)
        .minus(viewCoinScriptData.alreadycollected)
        .toNumber();
      setMaxAmount(change);
    }
  }, []);

  const withdraw = async () => {
    setLoading(true);
    try {
      if (!viewCoinScriptData) throw new Error("Coin script data not found");
      console.log("desiredAmount", desiredAmount);
      RPC.runScript(
        vestingContract.checkMathsRoot,
        {
          1: desiredAmount,
        },
        {
          "@AMOUNT": viewCoin.amount,
        }
      ).then(async (vars: any) => {
        await RPC.withdrawVestingContract(
          viewCoin,
          desiredAmount,
          vars.change,
          true,
          viewCoin.state
        );
        closeModal();
        setSuccess();
      });
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error && error.message
          ? error.message
          : error && error.error
          ? error.error
          : "Failed to withdraw";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["modal-wrapper"]}>
      <Stack spacing={2}>
        <Stack alignItems="flex-end">
          <CloseIcon onClick={closeModal} />
        </Stack>
        <h6>As root you can withdraw all or an amount at any point</h6>
        <TextField
          inputProps={{
            max: maxAmount,
          }}
          id="amount"
          name="amount"
          value={desiredAmount}
          onChange={(e: any) => {
            console.log(e.target.value);
            if (e.target.value > maxAmount) {
              setDesiredAmount(maxAmount);
            }

            if (e.target.value <= maxAmount) {
              setDesiredAmount(e.target.value);
            }
          }}
          onInput={(e: any) => {
            if (e.target.value > maxAmount) {
              setDesiredAmount(maxAmount);
            }
          }}
          type="number"
          disabled={loading}
        />
        <Button
          variant="contained"
          color="inherit"
          fullWidth
          disableElevation
          onClick={withdraw}
          disabled={loading}
        >
          {loading ? <CircularProgress size={16} /> : "Withdraw"}
        </Button>
      </Stack>
    </div>
  );
};

export default MiRootModal;
