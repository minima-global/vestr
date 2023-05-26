import { Stack } from "@mui/material";
import styles from "./Info.module.css";
import { useNavigate } from "react-router-dom";

const Info = () => {
  const navigate = useNavigate();
  return (
    <section className={styles["grid"]}>
      <h6>
        Vestr enables you to calculate, create and track vesting schedules for
        any token that you issue on the Minima blockchain.
      </h6>
      <Stack rowGap={2}>
        <div className={styles["helper__wrapper"]}>
          <h6>Creator</h6>
          <p>I want to create a vesting contract</p>
          <button type="button" onClick={() => navigate("/create")}>
            Create a contract
          </button>
        </div>
        <div className={styles["helper__wrapper"]}>
          <h6>Collector</h6>
          <p>I want to collect tokens from a vesting contract</p>
          <button type="button" onClick={() => navigate("collector")}>
            Collect tokens
          </button>
        </div>
      </Stack>
    </section>
  );
};

export default Info;
