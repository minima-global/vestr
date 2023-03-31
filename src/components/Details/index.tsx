import { useEffect, useState } from "react";
import {
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Details.module.css";
import Decimal from "decimal.js";
import * as CustomComponents from "../MiCustom";
import * as RPC from "../../minima/libs/RPC";
import { vestingContract } from "../../minima/libs/contracts";
import useChainHeight from "../../hooks/useChainHeight";
import OngoingTransaction from "../OngoingTransaction";
import { format } from "date-fns";
import { events } from "../../minima/libs/events";
import KeyIcon from "@mui/icons-material/Key";

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tip = useChainHeight();
  const [runScriptData, setRunScript] = useState<false | any>(false);

  const [rootOpen, setRootOpen] = useState(false);
  const [rootPaymentStatus, setRootPaymentStatus] = useState<false | string>(
    false
  );
  const [desiredAmount, setDesiredAmount] = useState<string>("");
  const [endedModal, setOpenEndedModal] = useState(false);
  const [contractEnded, setContractEnded] = useState(false);

  const [collectionStatus, setStatus] = useState<
    false | "ongoing" | "pending" | "complete" | "failed"
  >(false);
  const [error, setError] = useState<false | string>(false);

  const { C: viewingCoin } = location.state;

  const root = () => {
    RPC.runScript(
      vestingContract.checkMathsRoot,
      {
        1: desiredAmount,
      },
      {
        "@AMOUNT":
          viewingCoin.tokenid === "0x00"
            ? viewingCoin.amount
            : viewingCoin.tokenamount,
      }
    ).then(async (vars: any) => {
      RPC.withdrawVestingContract(
        viewingCoin,
        desiredAmount,
        vars.change,
        true,
        viewingCoin.state
      )
        .then((status) => {
          const commandPending = status === 1; // a command is pending
          const commandCompleted = status === 0; // status completed!

          if (commandPending) {
            setStatus("pending");
            setRootPaymentStatus(
              "Your payment must now be accepted in the pending actions."
            );
          }
          if (commandCompleted) {
            setStatus("complete");
            setRootPaymentStatus(
              "Your payment has completed and should arrive shortly to the withdrawal address, " +
                MDS.util.getStateVariable(viewingCoin, 0)
            );
          }

          setDesiredAmount("");
        })
        .catch((err: any) => {
          console.error(err);
          setStatus("failed");
          setRootPaymentStatus("Your payment has failed, " + err);
          setError("Withdrawal failed! " + err);
        });
    });
  };

  events.onNewBalance(() => {
    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((data) => {
        const coin = data.relevantCoins.find(
          (c) =>
            MDS.util.getStateVariable(c, 199) ===
            MDS.util.getStateVariable(viewingCoin, 199)
        );
        if (coin) {
          navigate("/dashboard/track/" + MDS.util.getStateVariable(coin, 199), {
            state: { C: coin },
          });
        }

        if (!coin) {
          setOpenEndedModal(true);
          setContractEnded(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
  const collectCoin = (
    coin: any,
    cancollect: string,
    changeAmount: string,
    root: boolean = false
  ) => {
    setStatus("ongoing");

    RPC.withdrawVestingContract(
      coin,
      cancollect,
      changeAmount,
      root,
      coin.state
    )
      .then((status) => {
        const commandPending = status === 1; // a command is pending
        const commandCompleted = status === 0; // status completed!

        if (commandPending) setStatus("pending");
        if (commandCompleted) setStatus("complete");
      })
      .catch((err: any) => {
        console.error(err);
        setStatus("failed");
        setError("Withdrawal failed! " + err);
      });
  };

  useEffect(() => {
    RPC.runScript(
      vestingContract.checkMaths,
      {
        1: MDS.util.getStateVariable(viewingCoin, 1),
        2: MDS.util.getStateVariable(viewingCoin, 2),
        3: MDS.util.getStateVariable(viewingCoin, 3),
        4: MDS.util.getStateVariable(viewingCoin, 4),
        5: MDS.util.getStateVariable(viewingCoin, 5),
      },
      {
        "@AMOUNT":
          viewingCoin.tokenid === "0x00"
            ? viewingCoin.amount
            : viewingCoin && "tokenamount" in viewingCoin
            ? viewingCoin.tokenamount
            : "0",
        "@BLOCK": tip && tip.block ? tip.block : "0",
        "@COINAGE": viewingCoin.created,
      }
    ).then((vars: any) => {
      // console.log(vars);
      setRunScript(vars);
    });
  }, [tip, location.state]);

  return (
    <Stack mb={2}>
      <Modal open={!!collectionStatus} className={styles["modal"]}>
        <OngoingTransaction>
          <h5>Transaction in progress</h5>
          <div id="content">
            <ul id="list">
              <li>
                <h6>Status</h6>
                <p>
                  {collectionStatus === "ongoing" ? (
                    <CircularProgress size={8} />
                  ) : collectionStatus === "complete" ? (
                    "Completed!"
                  ) : collectionStatus === "failed" ? (
                    error
                  ) : collectionStatus === "pending" ? (
                    "Pending Action"
                  ) : (
                    "Not set"
                  )}
                </p>
              </li>
            </ul>
            <Stack alignItems="flex-end">
              <button
                disabled={collectionStatus === "ongoing"}
                onClick={() => setStatus(false)}
              >
                {collectionStatus === "ongoing" ? (
                  <CircularProgress size={8} />
                ) : (
                  "Ok"
                )}
              </button>
            </Stack>
          </div>
        </OngoingTransaction>
      </Modal>
      <Modal open={endedModal} className={styles["modal"]}>
        <OngoingTransaction>
          <h5>Contract Completed</h5>
          <div id="content">
            <ul id="list">
              <li>
                <h6>Status</h6>
                <p>Woohoo! You have collected all funds for this contract.</p>
              </li>
            </ul>
            <Stack alignItems="flex-end">
              <button onClick={() => navigate("/dashboard/track")}>Done</button>
            </Stack>
          </div>
        </OngoingTransaction>
      </Modal>
      <Modal open={rootOpen} className={styles["modal"]}>
        <OngoingTransaction>
          <h5>Root Withdraw</h5>
          <div id="content">
            <Stack id="withdraw">
              {rootPaymentStatus && <p id="status">{rootPaymentStatus}</p>}

              <h5>Enter Amount:</h5>
              <TextField
                InputProps={{
                  inputProps: {
                    max:
                      viewingCoin.tokenid === "0x00"
                        ? parseInt(viewingCoin.amount)
                        : parseInt(viewingCoin.tokenamount),
                    min: 0,
                  },
                  endAdornment: (
                    <button
                      type="button"
                      onClick={() => {
                        const neverWithdrew = new Decimal(
                          MDS.util.getStateVariable(viewingCoin, 1)
                        )
                          .minus(
                            viewingCoin.tokenid === "0x00"
                              ? viewingCoin.amount
                              : viewingCoin.tokenamount
                          )
                          .equals(0);
                        if (!neverWithdrew) {
                          setDesiredAmount(
                            new Decimal(
                              MDS.util.getStateVariable(viewingCoin, 1)
                            )
                              .minus(runScriptData.alreadycollected)
                              .toString()
                          );
                        }

                        if (neverWithdrew) {
                          setDesiredAmount(
                            new Decimal(
                              MDS.util.getStateVariable(viewingCoin, 1)
                            ).toString()
                          );
                        }
                      }}
                    >
                      Max
                    </button>
                  ),
                }}
                placeholder="enter amount"
                id="amount"
                name="amount"
                type="text"
                value={desiredAmount}
                fullWidth
                onChange={(e: any) => {
                  try {
                    new Decimal(e.target.value);
                    const neverWithdrew = new Decimal(
                      MDS.util.getStateVariable(viewingCoin, 1)
                    )
                      .minus(
                        viewingCoin.tokenid === "0x00"
                          ? viewingCoin.amount
                          : viewingCoin.tokenamount
                      )
                      .equals(0);

                    // if user never withdrew then set max
                    if (neverWithdrew) {
                      console.log("user never withdrew..");
                      const max = new Decimal(
                        MDS.util.getStateVariable(viewingCoin, 1)
                      ).toString();

                      if (
                        e.target.value &&
                        new Decimal(e.target.value).greaterThan(max)
                      ) {
                        console.log("setting 1");

                        setDesiredAmount(max);
                      }
                      if (
                        e.target.value &&
                        new Decimal(e.target.value).lessThanOrEqualTo(max)
                      ) {
                        console.log("setting 2");

                        setDesiredAmount(e.target.value);
                      }
                    }
                    if (!neverWithdrew) {
                      console.log("user withdrew..");

                      const max =
                        e.target.value &&
                        new Decimal(MDS.util.getStateVariable(viewingCoin, 1))
                          .minus(runScriptData.alreadycollected)
                          .toString();

                      if (new Decimal(e.target.value).greaterThan(max)) {
                        console.log("setting 1");

                        setDesiredAmount(max);
                      }
                      if (new Decimal(e.target.value).lessThanOrEqualTo(max)) {
                        console.log("setting 2");

                        setDesiredAmount(e.target.value);
                      }
                    }
                  } catch (error) {
                    setDesiredAmount("");
                  }
                }}
              />
              <p id="help">
                When signing with the root key set on creation of this contract,
                you are allowed to collect any amount at any given point.
              </p>
            </Stack>
            <Stack
              alignItems="flex-end"
              flexDirection="row"
              gap={0.5}
              justifyContent="flex-end"
            >
              <button
                id="cancel"
                onClick={() => {
                  setRootOpen(false);
                  setRootPaymentStatus("");
                }}
              >
                Cancel
              </button>
              <button onClick={root}>Collect</button>
            </Stack>
          </div>
        </OngoingTransaction>
      </Modal>

      <Stack className={styles["details"]}>
        <Toolbar className={styles["toolbar"]}>
          <div>
            {runScriptData &&
              "isrooted" &&
              runScriptData.isrooted === "TRUE" && (
                <button onClick={() => setRootOpen(true)} id="root">
                  Root <KeyIcon />
                </button>
              )}
          </div>
          <div>
            <img
              onClick={() => navigate("/dashboard/track")}
              src="./assets/close.svg"
            />
          </div>
        </Toolbar>
        <h5>Your Contract</h5>
        {(!runScriptData || !viewingCoin) && (
          <Stack mt={2} alignItems="center" justifyContent="center">
            <CircularProgress size={16} />
          </Stack>
        )}
        {!!runScriptData && (
          <>
            <Stack>
              {!!runScriptData &&
                "cliffed" in runScriptData &&
                runScriptData.cliffed === "TRUE" &&
                tip && (
                  <CustomComponents.Cliffed>
                    <h6>
                      Contract has a cliffing period set. Contract begins within
                      another{" "}
                      {new Decimal(MDS.util.getStateVariable(viewingCoin, 3))
                        .minus(tip.block)
                        .toString()}{" "}
                      blocks.
                    </h6>
                  </CustomComponents.Cliffed>
                )}
              {!!runScriptData &&
                "mustwait" in runScriptData &&
                runScriptData.mustwait === "TRUE" &&
                tip && (
                  <CustomComponents.Cliffed>
                    <h6>
                      Contract has a grace period. You have to wait another{" "}
                      {runScriptData.mustwaitblocks} blocks.
                    </h6>
                  </CustomComponents.Cliffed>
                )}

              <CustomComponents.MiContractSummary>
                <div>
                  <h6>Total Locked</h6>
                  <p>{MDS.util.getStateVariable(viewingCoin, 1)}</p>
                </div>
                <div>
                  <h6>Amount Collected</h6>
                  {viewingCoin.tokenid === "0x00" && (
                    <p>
                      {new Decimal(MDS.util.getStateVariable(viewingCoin, 1))
                        .minus(viewingCoin.amount)
                        .toString()}
                    </p>
                  )}
                  {viewingCoin.tokenid !== "0x00" && viewingCoin && (
                    <p>
                      {new Decimal(MDS.util.getStateVariable(viewingCoin, 1))
                        .minus(viewingCoin.tokenamount)
                        .toString()}
                    </p>
                  )}
                </div>
                <div>
                  <h6>Available Withdrawal</h6>
                  <p>
                    {runScriptData &&
                    "cancollect" in runScriptData &&
                    "cliffed" in runScriptData &&
                    runScriptData.cliffed === "FALSE"
                      ? runScriptData.cancollect
                      : "N/A"}
                  </p>
                </div>
              </CustomComponents.MiContractSummary>
            </Stack>
            <Stack spacing={5}>
              <CustomComponents.MiCoinDetails>
                <ul>
                  <li>
                    <p>Contract Name</p>
                    <p id="name">
                      {MDS.util.getStateVariable(viewingCoin, 7) !== "[]" &&
                        decodeURIComponent(
                          MDS.util
                            .getStateVariable(viewingCoin, 7)
                            .substring(
                              1,
                              MDS.util.getStateVariable(viewingCoin, 7).length -
                                1
                            )
                        )}
                      {MDS.util.getStateVariable(viewingCoin, 7) === "[]" &&
                        "N/A"}
                    </p>
                  </li>
                  <li>
                    <p>Contract id</p>
                    <p>{MDS.util.getStateVariable(viewingCoin, 199)}</p>
                  </li>
                  <li>
                    <p>Created at</p>
                    <p>
                      {format(
                        parseInt(MDS.util.getStateVariable(viewingCoin, 6)),
                        "hh:mm:ss a, dd/MM/y"
                      )}
                    </p>
                  </li>
                  <li>
                    <p>Coin id</p>
                    <p>{viewingCoin.coinid}</p>
                  </li>
                  <li>
                    <p>Contract began on block</p>
                    <p>
                      {runScriptData && "startblock" in runScriptData
                        ? runScriptData.startblock
                        : "N/A"}
                    </p>
                  </li>
                  <li>
                    <p>Contract rules expire after block</p>
                    <p>
                      {runScriptData && "finalblock" in runScriptData
                        ? runScriptData.finalblock
                        : "N/A"}
                    </p>
                  </li>
                  <li>
                    <p>Withdrawal address</p>
                    <p>{viewingCoin.address}</p>
                  </li>
                  <li>
                    <p>Root key</p>
                    <p>
                      {runScriptData && "rootkey" in runScriptData
                        ? runScriptData.rootkey
                        : "N/A"}
                    </p>
                  </li>
                </ul>
              </CustomComponents.MiCoinDetails>
              <Stack textAlign="center">
                {!contractEnded && (
                  <button
                    onClick={() =>
                      collectCoin(
                        viewingCoin,
                        runScriptData.cancollect,
                        runScriptData.change
                      )
                    }
                    className={styles["collect-btn"]}
                    disabled={
                      (runScriptData &&
                        "cliffed" in runScriptData &&
                        runScriptData.cliffed === "TRUE") ||
                      (runScriptData &&
                        "mustwait" in runScriptData &&
                        runScriptData.mustwait === "TRUE") ||
                      (runScriptData &&
                        "cancollect" in runScriptData &&
                        runScriptData.cancollect <= 0)
                    }
                  >
                    {runScriptData &&
                    "mustwait" in runScriptData &&
                    runScriptData.mustwait === "TRUE"
                      ? "Wait " + runScriptData.mustwaitblocks + " blocks"
                      : "Collect"}
                  </button>
                )}

                {contractEnded && (
                  <button
                    className={styles["collect-btn"]}
                    onClick={() => navigate("/dashboard/track")}
                  >
                    Done
                  </button>
                )}
              </Stack>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default Details;
