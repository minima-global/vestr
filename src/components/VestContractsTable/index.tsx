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
import { Box, Button, Card, Modal, Stack } from "@mui/material";

import Decimal from "decimal.js";
import MiRootModal from "../MiCustom/MiRootModal/MiRootModal";
import { Coin } from "../../@types";
import MiSuccessModal from "../MiCustom/MiSuccessModal/MiSuccessModal";
import MiError from "../MiCustom/MiError/MiError";
import { events } from "../../minima/libs/events";
import { MiTitle } from "../MiCustom/MiTitle/MiTitle";

export default function DataTable() {
  const [relevantCoins, setRelevantCoins] = React.useState<any[]>([]);

  const [currentBlockHeight, setCurrentBlockHeight] = React.useState(0);
  const [error, setError] = React.useState<false | string>(false);
  const [viewCoin, setView] = React.useState<false | Coin>(false);
  const [viewCoinScriptData, setViewCoinScriptData] = React.useState<
    false | any
  >(false);

  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [transactionPending, setTransactionPending] = React.useState(false);
  const [viewRootModal, setViewRootModal] = React.useState(false);
  const closeRootModal = () => setViewRootModal(false);
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    if (transactionPending) {
      setTransactionPending(false);
    }
  };

  const collectCoin = async (
    coin: any,
    cancollect: string,
    changeAmount: string,
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
    RPC.getCurrentBlockHeight().then((h) => {
      setCurrentBlockHeight(h);
    });

    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((result: any) => {
        // console.log("getCoinsByAddress", result);
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
            4: viewCoin.state[4].data,
            5: viewCoin.state[5].data,
          },
          {
            "@AMOUNT":
              viewCoin.tokenid === "0x00"
                ? viewCoin.amount
                : viewCoin.tokenamount,
            "@BLOCK": "" + height,
            "@COINAGE": viewCoin.created,
          }
        ).then((vars: any) => {
          // console.log("runScript", vars);
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
            4: viewCoin.state[4].data,
            5: viewCoin.state[5].data,
          },
          {
            "@AMOUNT":
              viewCoin.tokenid === "0x00"
                ? viewCoin.amount
                : viewCoin.tokenamount,
            "@BLOCK": "" + height,
            "@COINAGE": viewCoin.created,
          }
        ).then((vars: any) => {
          // console.log("runScript", vars);
          setViewCoinScriptData(vars);
        });
      });
    }
  }, [viewCoin]);

  const setWithdrawalSuccess = (isPending: boolean = false) => {
    if (isPending) {
      setTransactionPending(true);
    }
    setView(false);
    setViewCoinScriptData(false);
    setShowSuccessModal(true);
  };

  React.useEffect(() => {
    RPC.getCurrentBlockHeight().then((h) => {
      setCurrentBlockHeight(h);
    });
  }, []);

  React.useEffect(() => {
    setView(false);
    setViewCoinScriptData(false);

    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((result: any) => {
        // console.log(result);
        setRelevantCoins(result.relevantCoins);
      })
      .catch((err) => {
        const errorMessage =
          err && err.message ? err.message : err ? err : "Failed to fetch data";
        setError(errorMessage);
      });
  }, []);

  return (
    <>
      <Modal open={showSuccessModal}>
        <Box>
          <MiSuccessModal
            title={
              !transactionPending
                ? "Withdrew Successfully"
                : "Withdrawal Pending"
            }
            subtitle={
              !transactionPending
                ? "Check your Wallet Minidapp balance"
                : "Now go to your pending transactions and accept this action"
            }
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
            setSuccess={setWithdrawalSuccess}
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
          {relevantCoins.length === 0 && (
            <div className={styles["unavailable"]}>No contracts available</div>
          )}

          {relevantCoins.length > 0 && (
            <TableContainer
              className={styles["table-container"]}
              component={Paper}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Contract</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Name</TableCell>
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
                      <TableCell
                        align="right"
                        sx={{
                          maxWidth: "100px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.state[1].data}
                      </TableCell>
                      {row.tokenid !== "0x00" &&
                        row.token &&
                        row.token.name && (
                          <TableCell align="right">
                            {row.token.name.name}
                          </TableCell>
                        )}
                      {row.tokenid === "0x00" && (
                        <TableCell align="right">Minima</TableCell>
                      )}
                      <TableCell
                        align="right"
                        sx={{
                          maxWidth: "100px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.tokenid}
                      </TableCell>
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

      {viewCoin && !viewCoinScriptData && (
        <Box className={styles["view-wrapper"]}>
          <div>Data not found, refresh</div>
        </Box>
      )}
      {viewCoin && viewCoinScriptData && (
        <Box className={styles["view-wrapper"]}>
          <Stack className={styles["view"]} spacing={4}>
            {error && (
              <MiError>
                <label>{error}</label>
              </MiError>
            )}
            {viewCoinScriptData.cliffed === "TRUE" && (
              <>
                <MiTitle>
                  <label>
                    This contract has a cliffing period, can start withdrawing
                    in
                    {" " +
                      new Decimal(viewCoin.state[2].data)
                        .minus(currentBlockHeight)
                        .toNumber()}{" "}
                    blocks
                  </label>
                </MiTitle>
              </>
            )}
            <>
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

                    {viewCoin.tokenid === "0x00" && <p>{viewCoin.amount}</p>}
                    {viewCoin.tokenid !== "0x00" && (
                      <p>{viewCoin.tokenamount}</p>
                    )}
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
                    <h6>Root Key</h6>
                    <p>
                      {viewCoin.state[5].data === "0x21"
                        ? "No root key set"
                        : viewCoin.state[5].data}
                    </p>
                  </li>
                  <li>
                    <h6>Withdrawal Address</h6>
                    <p>{viewCoin.state[0].data}</p>
                  </li>
                  <li>
                    <h6>Can Withdraw Now</h6>
                    <p>
                      {viewCoinScriptData &&
                        viewCoinScriptData.cliffed === "TRUE" &&
                        "N/A"}
                      {viewCoinScriptData &&
                        viewCoinScriptData.cliffed !== "TRUE" &&
                        viewCoinScriptData.cancollect > 0 &&
                        viewCoin.tokenid === "0x00" &&
                        viewCoinScriptData.cancollect + " / " + viewCoin.amount}
                      {viewCoinScriptData &&
                        viewCoinScriptData.cliffed !== "TRUE" &&
                        viewCoinScriptData.cancollect > 0 &&
                        viewCoin.tokenid !== "0x00" &&
                        viewCoinScriptData.cancollect +
                          " / " +
                          viewCoin.tokenamount}
                      {viewCoinScriptData &&
                        viewCoinScriptData.cliffed !== "TRUE" &&
                        viewCoinScriptData.cancollect <= 0 &&
                        "N/A"}
                    </p>
                  </li>
                  <li>
                    <h6>Already Collected</h6>
                    <p>
                      {viewCoinScriptData
                        ? viewCoinScriptData.alreadycollected
                        : "N/A"}
                    </p>
                  </li>
                  <li>
                    <h6>Change</h6>
                    <p>
                      {viewCoinScriptData &&
                        viewCoin.tokenid === "0x00" &&
                        viewCoinScriptData.cliffed !== "TRUE" &&
                        viewCoinScriptData.change + " / " + viewCoin.amount}
                      {viewCoinScriptData &&
                        viewCoin.tokenid !== "0x00" &&
                        viewCoinScriptData.cliffed !== "TRUE" &&
                        viewCoinScriptData.change +
                          " / " +
                          viewCoin.tokenamount}
                    </p>
                  </li>
                  {viewCoinScriptData.mustwait === "TRUE" && (
                    <li>
                      <h6>Can collect every</h6>
                      <p>{viewCoin.state[4].data + " blocks"}</p>
                    </li>
                  )}
                </ul>
              </Stack>

              {viewCoinScriptData.cliffed !== "TRUE" && (
                <Stack spacing={0.5}>
                  <Button
                    type="button"
                    disableElevation
                    disabled={
                      viewCoinScriptData.mustwait === "TRUE" ||
                      viewCoinScriptData.cancollect <= 0
                    }
                    fullWidth
                    color="inherit"
                    variant="contained"
                    onClick={() => {
                      // console.log(viewCoinScriptData.cancollect);
                      // console.log(viewCoinScriptData.change);
                      collectCoin(
                        viewCoin,
                        viewCoinScriptData.cancollect,
                        viewCoinScriptData.change
                      );
                    }}
                  >
                    {viewCoinScriptData.mustwait === "TRUE"
                      ? `Can collect in ${new Decimal(viewCoin.state[4].data)
                          .minus(
                            new Decimal(currentBlockHeight).minus(
                              viewCoinScriptData.coinsage
                            )
                          )
                          .toNumber()}`
                      : "Withdraw"}
                  </Button>

                  <Button
                    type="button"
                    disabled={viewCoinScriptData.isrooted === "FALSE"}
                    disableElevation
                    fullWidth
                    color="inherit"
                    variant="contained"
                    onClick={() => setViewRootModal(true)}
                  >
                    Root
                  </Button>
                </Stack>
              )}
            </>
          </Stack>
        </Box>
      )}
      <Stack mt={2}>
        <Box>
          <p className={styles["block"]}>
            Current block height: {currentBlockHeight}
          </p>
        </Box>
      </Stack>
    </>
  );
}
