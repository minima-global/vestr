import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { vestingContract } from "../../minima/libs/contracts";
import * as RPC from "../../minima/libs/RPC";
import styles from "./VestContractsTable.module.css";
import { Box, Button, Modal, Stack } from "@mui/material";

import Decimal from "decimal.js";
import MiRootModal from "../MiCustom/MiRootModal/MiRootModal";
import { Coin } from "../../@types";
import MiSuccessModal from "../MiCustom/MiSuccessModal/MiSuccessModal";
import MiError from "../MiCustom/MiError/MiError";
import { events } from "../../minima/libs/events";

export default function DataTable() {
  const [relevantCoins, setRelevantCoins] = React.useState<any[]>([]);

  const [error, setError] = React.useState<false | string>(false);
  const [viewCoin, setView] = React.useState<false | Coin>(false);
  const [viewCoinScriptData, setViewCoinScriptData] = React.useState<
    false | any
  >(false);

  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [viewRootModal, setViewRootModal] = React.useState(false);
  const closeRootModal = () => setViewRootModal(false);
  const closeSuccessModal = () => setShowSuccessModal(false);

  const collectCoin = async (
    coin: any,
    cancollect: number,
    changeAmount: number,
    root: boolean = false
  ) => {
    setError(false);
    try {
      await RPC.withdrawVestingContract(
        coin,
        cancollect,
        changeAmount,
        root,
        coin.state
      );

      setView(false);
      setViewCoinScriptData(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err && err.message ? err.message : err ? err : "Failed to withdraw";
      setError(errorMessage);
    }
  };

  events.onNewBlock(() => {
    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((result: any) => {
        console.log(result);
        setRelevantCoins(result.relevantCoins);
      })
      .catch((err) => {
        const errorMessage =
          err && err.message ? err.message : err ? err : "Failed to fetch data";
        setError(errorMessage);
      });

    if (viewCoin) {
      RPC.getCurrentBlockHeight().then((height) => {
        RPC.runScript(
          vestingContract.checkMaths,
          {
            1: viewCoin.state[1].data,
            2: viewCoin.state[2].data,
            3: viewCoin.state[3].data,
          },
          {
            "@AMOUNT": viewCoin.amount,
            "@BLOCK": "" + height,
          }
        ).then((vars: any) => {
          console.log(vars);
          setViewCoinScriptData(vars);
        });
      });
    }
  });

  React.useEffect(() => {
    if (viewCoin) {
      RPC.getCurrentBlockHeight().then((height) => {
        RPC.runScript(
          vestingContract.checkMaths,
          {
            1: viewCoin.state[1].data,
            2: viewCoin.state[2].data,
            3: viewCoin.state[3].data,
          },
          {
            "@AMOUNT": viewCoin.amount,
            "@BLOCK": "" + height,
          }
        ).then((vars: any) => {
          console.log(vars);
          setViewCoinScriptData(vars);
        });
      });
    }
  }, [viewCoin]);

  React.useEffect(() => {
    setView(false);
    setViewCoinScriptData(false);

    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((result: any) => {
        console.log(result);
        setRelevantCoins(result.relevantCoins);
      })
      .catch((err) => {
        const errorMessage =
          err && err.message ? err.message : err ? err : "Failed to fetch data";
        setError(errorMessage);
      });
  }, []);

  return (
    <div className={styles["table-wrapper"]}>
      <Modal open={showSuccessModal}>
        <Box>
          <MiSuccessModal
            title="Withdrew Successfully"
            subtitle="Check your Wallet Minidapp balance"
            closeModal={closeSuccessModal}
          />
        </Box>
      </Modal>
      <Modal open={viewRootModal}>
        <Box>
          <MiRootModal
            viewCoin={viewCoin}
            viewCoinScriptData={viewCoinScriptData}
            closeModal={closeRootModal}
            setError={setError}
          />
        </Box>
      </Modal>

      {!viewCoin && (
        <>
          {error && (
            <MiError>
              <label>{error}</label>
            </MiError>
          )}
          {relevantCoins.length === 0 && <div>No contracts found</div>}

          {relevantCoins.length > 0 && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Contract</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Token ID</TableCell>
                    <TableCell align="right">Contract Start</TableCell>
                    <TableCell align="right">Contract Ends</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relevantCoins.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {i}
                      </TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell align="right">{row.tokenid}</TableCell>
                      <TableCell align="right">{row.state[2].data}</TableCell>
                      <TableCell align="right">{row.state[3].data}</TableCell>
                      <TableCell align="right">
                        <button
                          onClick={() => {
                            setView(row);
                          }}
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {viewCoin && viewCoinScriptData && (
        <>
          <Stack className={styles["view"]} spacing={4}>
            {error && (
              <MiError>
                <label>{error}</label>
              </MiError>
            )}
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <h6>Contract {viewCoin.coinid}</h6>
              <button
                className={styles["back-btn"]}
                onClick={() => {
                  setView(false);
                  setViewCoinScriptData(false);
                }}
              >
                Go back
              </button>
            </Stack>

            <Stack>
              <ul>
                <li>
                  <h6>Total Amount Locked</h6>
                  <p>{viewCoin.amount}</p>
                </li>
                <li>
                  <h6>Contract Starts</h6>
                  <p>{viewCoin.state[2].data}</p>
                </li>
                <li>
                  <h6>Contract Ends</h6>
                  <p>{viewCoin.state[3].data}</p>
                </li>
                <li>
                  <h6>Cliff Period</h6>
                  <p>{viewCoin.state[3].data}</p>
                </li>
                <li>
                  <h6>Root Key</h6>
                  <p>{viewCoin.state[4].data}</p>
                </li>
                <li>
                  <h6>Withdrawal Address</h6>
                  <p>{viewCoin.state[0].data}</p>
                </li>
                <li>
                  <h6>Can Withdraw Now</h6>
                  <p>
                    {viewCoinScriptData
                      ? viewCoinScriptData.cancollect + " / " + viewCoin.amount
                      : "N/a"}
                  </p>
                </li>
                <li>
                  <h6>Already Collected</h6>
                  <p>
                    {viewCoinScriptData
                      ? viewCoinScriptData.alreadycollected
                      : "N/a"}
                  </p>
                </li>
                <li>
                  <h6>Change</h6>
                  <p>
                    {viewCoinScriptData
                      ? viewCoinScriptData.change + " / " + viewCoin.amount
                      : "N/a"}
                  </p>
                </li>
              </ul>
            </Stack>
            <Stack spacing={0.5}>
              <Button
                type="button"
                disableElevation
                fullWidth
                color="inherit"
                variant="contained"
                onClick={() => {
                  console.log(viewCoinScriptData.cancollect);
                  console.log(viewCoinScriptData.change);
                  collectCoin(
                    viewCoin,
                    viewCoinScriptData.cancollect,
                    viewCoinScriptData.change
                  );
                }}
              >
                Withdraw
              </Button>

              <Button
                type="button"
                disableElevation
                fullWidth
                color="inherit"
                variant="contained"
                onClick={() => setViewRootModal(true)}
              >
                Root
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </div>
  );
}

const calculateBlockWithdrawalAmount = async (
  finalBlock: number,
  startBlock: number,
  totalAmountLocked: number,
  currentCoinAmount: number
) => {
  try {
    const currentBlockHeight = await RPC.getCurrentBlockHeight();
    const dTotalAmountLocked = new Decimal(totalAmountLocked);
    const totalduration = new Decimal(finalBlock).minus(
      new Decimal(startBlock)
    );

    const contractAlreadyFinished = new Decimal(currentBlockHeight).greaterThan(
      new Decimal(finalBlock)
    );
    // you can collect all amount since you contract finished
    if (contractAlreadyFinished) {
      console.log(
        "Contract already ended.. can collect all amount/rest of amount in full"
      );
      const howMuchHaveIAlreadyCollected = dTotalAmountLocked.minus(
        new Decimal(currentCoinAmount)
      );

      return howMuchHaveIAlreadyCollected.equals(0)
        ? dTotalAmountLocked.toNumber()
        : dTotalAmountLocked.minus(new Decimal(currentCoinAmount)).toNumber();
    }

    let blockamount = new Decimal(0);
    if (totalduration.lessThanOrEqualTo(0)) {
      blockamount = new Decimal(currentCoinAmount);
    }

    if (totalduration.greaterThan(0)) {
      blockamount = dTotalAmountLocked.dividedBy(totalduration);
    }

    let totalAmountTime = new Decimal(currentBlockHeight).minus(
      new Decimal(startBlock)
    );

    let totalOwedAmount = totalAmountTime.times(blockamount);
    let alreadyCollected = dTotalAmountLocked.minus(
      new Decimal(currentCoinAmount)
    );

    let canCollect = totalOwedAmount.minus(alreadyCollected);

    return canCollect.toNumber();
  } catch (error) {
    throw error;
  }
};
