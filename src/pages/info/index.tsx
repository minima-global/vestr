import { Stack } from "@mui/material";
import styles from "./Info.module.css";
import { useNavigate } from "react-router-dom";

const Info = () => {
  const navigate = useNavigate();
  return (
    <section className={styles["grid"]}>
      <h6>
        Vestr enables you to create and collect vesting contracts for any Minima
        token.
      </h6>
      <Stack rowGap={2}>
        <div className={styles["helper__wrapper"]}>
          <h6>Creator</h6>
          <p>I want to create a vesting contract</p>
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/creator/create", {
                state: { tokenid: "0x00" },
              })
            }
          >
            Create a contract
          </button>
        </div>
        <div className={styles["helper__wrapper"]}>
          <h6>Collector</h6>
          <p>I want to collect tokens from a vesting contract</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/collector")}
          >
            Collect tokens
          </button>
        </div>
      </Stack>
    </section>
  );
};

export default Info;
