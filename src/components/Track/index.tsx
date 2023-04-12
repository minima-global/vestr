import { useState, useEffect } from "react";
import { Stack, Toolbar } from "@mui/material";
import * as RPC from "../../minima/libs/RPC";
import styles from "./Track.module.css";
import { vestingContract } from "../../minima/libs/contracts";
import { Coin } from "../../@types";
import * as CustomComponents from "../MiCustom";
import Decimal from "decimal.js";
// import KeyIcon from "@mui/icons-material/Key";

import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { events } from "../../minima/libs/events";
import { useDrawer } from "../Dashboard";
import useChainHeight from "../../hooks/useChainHeight";
const Track = () => {
  const toggle = useDrawer();
  const tip = useChainHeight();
  const [contracts, setContracts] = useState<Map<string, Coin>>(new Map());
  const navigate = useNavigate();
  const isViewingDetail = useMatch("/dashboard/track/:id");

  events.onNewBalance(() => {
    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((data) => {
        const map = new Map();

        data.relevantCoins.map((c) =>
          map.set(MDS.util.getStateVariable(c, 199), c)
        );

        setContracts(map);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  useEffect(() => {
    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((data) => {
        const map = new Map();

        data.relevantCoins.map((c) =>
          map.set(MDS.util.getStateVariable(c, 199), c)
        );

        // console.log("mapData", map.size);

        setContracts(map);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [navigate]);

  return (
    <>
      {!!isViewingDetail && <Outlet />}

      {!isViewingDetail && (
        <Stack className={styles["track"]}>
          <Toolbar className={styles["toolbar"]}>
            <div className={styles["home"]}>
              <img onClick={toggle} id="home" src="./assets/menu.svg" />
            </div>
            <Stack
              alignItems="flex-end"
              flexDirection="column"
              justifyContent="space-between"
              gap={0.5}
            >
              {/* <div>
                <p>Has a root key</p>
                <KeyIcon />
              </div> */}
              <div>
                <p>Top block {tip && tip.block ? tip.block : "N/A"}</p>
              </div>
              <div>
                <p>Wait between collections disabled</p>
                <img src="./assets/hourglass_disabled.svg" />
              </div>
              <div>
                <p>Wait between collections enabled</p>
                <img src="./assets/hourglass_full.svg" />
              </div>
            </Stack>
          </Toolbar>
          <h5>Your Vesting Contracts</h5>
          <Stack>
            <CustomComponents.MiList>
              <>
                {contracts.size === 0 && <p>No contracts available yet...</p>}

                {contracts.size > 0 &&
                  Array.from(contracts.values()).map((C) => (
                    <li
                      onClick={() =>
                        navigate(MDS.util.getStateVariable(C, 199), {
                          state: { C: C },
                        })
                      }
                      key={C.coinid}
                    >
                      <div>
                        <img src="./assets/toll.svg" />
                        <div>
                          {/* {MDS.util.getStateVariable(C, 7) !== "[]" && (
                            <h6>
                              {decodeURIComponent(
                                MDS.util
                                  .getStateVariable(C, 7)
                                  .substring(
                                    1,
                                    MDS.util.getStateVariable(C, 7).length - 1
                                  )
                              )}
                            </h6>
                          )} */}
                          <h6>{MDS.util.getStateVariable(C, 199)}</h6>
                          {/* {MDS.util.getStateVariable(C, 7) === "[]" && (
                          )} */}
                          {C.tokenid === "0x00" && (
                            <p>
                              {C.amount + "/" + MDS.util.getStateVariable(C, 1)}
                            </p>
                          )}
                          {C.tokenid !== "0x00" && (
                            <p>
                              {C.tokenamount +
                                "/" +
                                MDS.util.getStateVariable(C, 1)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        {/* {MDS.util.getStateVariable(C, 5) !== "0x21" && (
                          <KeyIcon />
                        )} */}
                        {new Decimal(
                          MDS.util.getStateVariable(C, 4)
                        ).greaterThan(0) && (
                          <img src="./assets/hourglass_full.svg" />
                        )}
                        {new Decimal(MDS.util.getStateVariable(C, 4)).equals(
                          0
                        ) && <img src="./assets/hourglass_disabled.svg" />}

                        {C.tokenid === "0x00" && (
                          <p>
                            Already collected:{" "}
                            {new Decimal(MDS.util.getStateVariable(C, 1))
                              .minus(C.amount)
                              .toString()}
                          </p>
                        )}
                        {C.tokenid !== "0x00" && C.tokenamount && (
                          <p>
                            Already collected:{" "}
                            {new Decimal(MDS.util.getStateVariable(C, 1))
                              .minus(C.tokenamount)
                              .toString()}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </>
            </CustomComponents.MiList>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Track;
