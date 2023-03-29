import { useState, useEffect } from "react";
import { Stack, Toolbar } from "@mui/material";
import * as RPC from "../../minima/libs/RPC";
import styles from "./Track.module.css";
import { vestingContract } from "../../minima/libs/contracts";
import { Coin } from "../../@types";
import * as CustomComponents from "../MiCustom";
import Decimal from "decimal.js";
import useChainHeight from "../../hooks/useChainHeight";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
const Track = () => {
  const [contracts, setContracts] = useState<Coin[]>([]);
  const tip = useChainHeight();
  const navigate = useNavigate();
  const isViewingDetail = useMatch("/dashboard/track/:id");

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
    <>
      {!!isViewingDetail && <Outlet />}

      {!isViewingDetail && (
        <Stack className={styles["track"]}>
          <Toolbar className={styles["toolbar"]}>
            <Stack
              alignItems="flex-end"
              flexDirection="column"
              justifyContent="flex-end"
              gap={0.5}
            >
              <div>
                <p>No wait between collections</p>
                <img src="/assets/hourglass_disabled.svg" />
              </div>
              <div>
                <p>Must wait per each collection</p>
                <img src="/assets/hourglass_full.svg" />
              </div>
            </Stack>
          </Toolbar>
          <h5>Your Vesting Contracts</h5>
          <Stack>
            <CustomComponents.MiList>
              {!contracts.length && <p>No contracts available yet...</p>}

              {!!contracts.length &&
                contracts.map((C) => (
                  <li
                    onClick={() => navigate(C.coinid, { state: { C: C } })}
                    key={C.coinid}
                  >
                    <div>
                      <img src="/assets/toll.svg" />
                      <div>
                        {C.tokenid === "0x00" && <h6>Minima</h6>}
                        {C.tokenid !== "0x00" && (
                          <h6>
                            {C.token &&
                            "name" in C.token &&
                            "name" in C.token.name
                              ? C.token.name.name
                              : "Custom Token"}
                          </h6>
                        )}
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
                      {new Decimal(MDS.util.getStateVariable(C, 4)).greaterThan(
                        0
                      ) && <img src="/assets/hourglass_full.svg" />}
                      {new Decimal(MDS.util.getStateVariable(C, 4)).equals(
                        0
                      ) && <img src="/assets/hourglass_disabled.svg" />}
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
            </CustomComponents.MiList>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Track;
