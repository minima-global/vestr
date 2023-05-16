import { useEffect, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import styles from "./Root.module.css";
import { events } from "../../minima/libs/events";
import { Stack } from "@mui/material";

const Root = () => {
  const isMatch = useMatch("/");
  const navigate = useNavigate();
  const [MDSStatus, setMDSStatus] = useState(true);

  useEffect(() => {
    events.onFail(() => setMDSStatus(false));
  });

  return (
    <>
      {!!isMatch && (
        <div className={styles["root"]}>
          <div>
            {!!MDSStatus && (
              <>
                <img src="./assets/icon.png" />
                <h5>Welcome to VESTR</h5>
                <button onClick={() => navigate("/dashboard")}>Enter</button>
              </>
            )}
            {!MDSStatus && (
              <>
                <img src="./assets/failed.svg" />
                <h5>MDS is currently unavailable</h5>
                <p>To fix this either,</p>
                <ul>
                  <li> Refresh this page and try again.</li>
                  <li>
                    <b>If you are on mobile you can:</b> check the status of
                    your node by accessing the health page and then refreshing
                    this page.
                  </li>
                  <li>
                    <b>If you are on desktop you can:</b>{" "}
                    <ol>
                      <li>
                        make sure you are logged into your MDS hub by navigating
                        to http://127.0.0.:9003/ and re-logging in.
                      </li>
                      <li>
                        make sure your node is running by typing `status` in
                        your local Minima node's terminal.
                      </li>
                    </ol>
                  </li>
                  <li></li>
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {!isMatch && (
        <div className={styles["root-layout"]}>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Root;
