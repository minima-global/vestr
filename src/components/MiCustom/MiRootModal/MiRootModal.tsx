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
  const [maxAmount, setMaxAmount] = useState("");
  const [desiredAmount, setDesiredAmount] = useState("");
  const { viewCoin, closeModal, setError, viewCoinScriptData, setSuccess } =
    props;

  const [loading, setLoading] = useState(false);
  // console.log("viewCoin", viewCoin);
  useEffect(() => {
    const neverWithdrew = new Decimal(viewCoin.state[1].data)
      .minus(
        viewCoin.tokenid === "0x00" ? viewCoin.amount : viewCoin.tokenamount
      )
      .equals(0);
    if (neverWithdrew) {
      setMaxAmount(
        new Decimal(
          viewCoin.tokenid === "0x00" ? viewCoin.amount : viewCoin.tokenamount
        ).toString()
      );
    }

    if (!neverWithdrew) {
      const change = new Decimal(viewCoin.state[1].data)
        .minus(viewCoinScriptData.alreadycollected)
        .toString();
      setMaxAmount(change);
    }
  }, []);

  const withdraw = async () => {
    setLoading(true);
    try {
      if (!viewCoinScriptData) throw new Error("Coin script data not found");

      RPC.runScript(
        vestingContract.checkMathsRoot,
        {
          1: desiredAmount,
        },
        {
          "@AMOUNT":
            viewCoin.tokenid === "0x00"
              ? viewCoin.amount
              : viewCoin.tokenamount,
        }
      ).then(async (vars: any) => {
        const result = await RPC.withdrawVestingContract(
          viewCoin,
          desiredAmount,
          vars.change,
          true,
          viewCoin.state
        );
        // console.log("Result from withdrawVestingContract", result);
        const transactionPending = typeof result === "string";

        setSuccess(transactionPending);
        closeModal();
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
        <h6>
          As root you can withdraw the remaining amount at any given point
        </h6>
        <TextField
          inputProps={{
            max: maxAmount,
          }}
          id="amount"
          name="amount"
          value={desiredAmount}
          onChange={(e: any) => {
            // console.log(e.target.value);
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
