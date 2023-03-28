import { useEffect, useState } from "react";
import { CircularProgress, Stack, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Details.module.css";
import Decimal from "decimal.js";
import * as CustomComponents from "../MiCustom";
import * as RPC from "../../minima/libs/RPC";
import { vestingContract } from "../../minima/libs/contracts";
import useChainHeight from "../../hooks/useChainHeight";
import MiError from "../MiCustom/MiError/MiError";

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tip = useChainHeight();
  const [runScriptData, setRunScript] = useState<false | any>(false);

  const { C: viewingCoin } = location.state;

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
            : viewingCoin.tokenamount,
        "@BLOCK": tip && tip.block ? tip.block : "0",
        "@COINAGE": viewingCoin.created,
      }
    ).then((vars: any) => {
      console.log(vars);
      setRunScript(vars);
    });
  }, [tip, location.state]);

  return (
    <Stack className={styles["details"]}>
      <Toolbar className={styles["toolbar"]}>
        <Stack
          alignItems="flex-end"
          flexDirection="column"
          justifyContent="flex-end"
          gap={0.5}
        >
          <div>
            <img onClick={() => navigate(-1)} src="/assets/close.svg" />
          </div>
        </Stack>
      </Toolbar>
      <h5>Your Contract</h5>
      {!runScriptData && (
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
                {viewingCoin.tokenid !== "0x00" && (
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
              <button
                className={styles["collect-btn"]}
                disabled={
                  runScriptData &&
                  "cliffed" in runScriptData &&
                  runScriptData.cliffed === "TRUE"
                }
              >
                Collect
              </button>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Details;
