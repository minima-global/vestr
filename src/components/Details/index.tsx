import { useEffect, useState } from "react";
import { CircularProgress, Modal, Stack, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Details.module.css";
import Decimal from "decimal.js";
import * as CustomComponents from "../MiCustom";
import * as RPC from "../../minima/libs/RPC";
import { vestingContract } from "../../minima/libs/contracts";
import useChainHeight from "../../hooks/useChainHeight";
import OngoingTransaction from "../OngoingTransaction";
import { format } from "date-fns";
import { Coin } from "../../@types";
import { events } from "../../minima/libs/events";

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tip = useChainHeight();
  const [runScriptData, setRunScript] = useState<false | any>(false);

  const [endedModal, setOpenEndedModal] = useState(false);
  const [contractEnded, setContractEnded] = useState(false);

  const [collectionStatus, setStatus] = useState<
    false | "ongoing" | "pending" | "complete" | "failed"
  >(false);
  const [error, setError] = useState<false | string>(false);

  const { C: viewingCoin } = location.state;

  events.onNewBalance(() => {
    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((data) => {
        const coins = data.relevantCoins;
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
        // console.log("withdrawVestingContract response", status);
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
      console.log(vars);
      setRunScript(vars);
    });
  }, [tip, location.state]);
  // console.log("coin", viewingCoin);
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

      <Stack className={styles["details"]}>
        <Toolbar className={styles["toolbar"]}>
          <Stack
            alignItems="flex-end"
            flexDirection="column"
            justifyContent="flex-end"
            gap={0.5}
          >
            <div>
              <img
                onClick={() => navigate("/dashboard/track")}
                src="/assets/close.svg"
              />
            </div>
          </Stack>
        </Toolbar>
        <h5>Your Contract</h5>
        {(!runScriptData || !viewingCoin) && (
          <Stack alignItems="center" justifyContent="center">
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
                      Contract has a minimum wait time until you are allowed to
                      begin collecting. You have to wait another{" "}
                      {new Decimal(MDS.util.getStateVariable(viewingCoin, 3))
                        .minus(tip.block)
                        .toString()}{" "}
                      blocks.
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
                  <h6>Can Withdraw Now</h6>
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
                    <p>Contract ID</p>
                    <p>{MDS.util.getStateVariable(viewingCoin, 199)}</p>
                  </li>
                  <li>
                    <p>Created At</p>
                    <p>
                      {format(
                        parseInt(MDS.util.getStateVariable(viewingCoin, 6)),
                        "hh:mm:ss a, dd/MM/y"
                      )}
                    </p>
                  </li>
                  <li>
                    <p>Coin ID</p>
                    <p>{viewingCoin.coinid}</p>
                  </li>
                  <li>
                    <p>Contract Created On Block</p>
                    <p>
                      {runScriptData && "startblock" in runScriptData
                        ? runScriptData.startblock
                        : "N/A"}
                    </p>
                  </li>
                  <li>
                    <p>Contract Rules Expire After Block</p>
                    <p>
                      {runScriptData && "finalblock" in runScriptData
                        ? runScriptData.finalblock
                        : "N/A"}
                    </p>
                  </li>
                  <li>
                    <p>Withdrawal Address</p>
                    <p>{viewingCoin.address}</p>
                  </li>
                  <li>
                    <p>Root Key</p>
                    <p>
                      {runScriptData && "rootkey" in runScriptData
                        ? runScriptData.rootkey
                        : "N/A"}
                    </p>
                  </li>
                </ul>
              </CustomComponents.MiCoinDetails>
              <Stack>
                {runScriptData &&
                  "mustwait" in runScriptData &&
                  runScriptData.mustwait === "TRUE" && (
                    <p>Grace period.. you have to wait another ... blocks</p>
                  )}
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
                      ? "Wait " +
                        new Decimal(MDS.util.getStateVariable(viewingCoin, 3))
                          .minus(new Decimal(tip ? tip.block : "0"))
                          .minus(runScriptData.coinsage)
                          .toString() +
                        " blocks"
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
