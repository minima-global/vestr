import { Outlet, useMatch, useNavigate } from "react-router-dom";
import styles from "./Root.module.css";

const Root = () => {
  const isMatch = useMatch("/");
  const navigate = useNavigate();

  return (
    <>
      {!!isMatch && (
        <div className={styles["root"]}>
          <div>
            <img src="./assets/icon.png" />
            <h5>Welcome to VESTR</h5>
            <button onClick={() => navigate("/dashboard/home")}>Enter</button>
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
