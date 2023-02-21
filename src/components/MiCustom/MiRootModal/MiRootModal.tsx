import { useEffect, useState } from "react";

import { Stack } from "@mui/system";
import { Button, CircularProgress, Modal, TextField } from "@mui/material";
import styles from "./MiModalLayout.module.css";
import CloseIcon from "@mui/icons-material/Close";

import * as RPC from "../../../minima/libs/RPC";

import Decimal from "decimal.js";
import MiSuccessModal from "../MiSuccessModal/MiSuccessModal";

const MiRootModal = (props: any) => {
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [desiredAmount, setDesiredAmount] = useState(0);
  const { viewCoin, closeModal, setError, viewCoinScriptData } = props;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const closeSuccessModal = () => setShowSuccessModal(false);

  const [loading, setLoading] = useState(false);
  console.log("viewCoin", viewCoin);
  useEffect(() => {
    const neverWithdrew = new Decimal(viewCoin.state[1].data)
      .minus(viewCoin.amount)
      .equals(0);
    if (neverWithdrew) {
      setMaxAmount(new Decimal(viewCoin.amount).toNumber());
    }

    if (!neverWithdrew) {
      const change = new Decimal(viewCoin.state[1].data)
        .minus(viewCoin.amount)
        .toNumber();

      setMaxAmount(change);
    }
  }, []);

  const withdraw = async () => {
    setLoading(true);
    try {
      if (!viewCoinScriptData) throw new Error("Coin script data not found");

      console.log(viewCoin);
      const changeAmount = viewCoinScriptData.change;
      await RPC.withdrawVestingContract(
        viewCoin,
        desiredAmount,
        changeAmount,
        true,
        viewCoin.state
      );
      closeModal();
      setShowSuccessModal(true);
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
      <Modal open={showSuccessModal}>
        <MiSuccessModal
          title="Root Withdrawal Successful"
          subtitle="Check your Wallet Minidapp balance"
          closeModal={closeSuccessModal}
        />
      </Modal>
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
