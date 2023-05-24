import styles from "./Root.module.css";
import { useEffect, useState } from "react";
import { events } from "../../minima/libs/events";
import { Outlet, useMatch, useNavigate } from "react-router-dom";

const Root = () => {
  const isMatch = useMatch("/");
  const navigate = useNavigate();
  const [MDSStatus, setMDSStatus] = useState(true);

  useEffect(() => {
    events.onFail(() => setMDSStatus(false));
  });

  return (
    <>
      {!isMatch && (
        <div className={styles["root-layout"]}>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Root;
