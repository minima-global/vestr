import { CircularProgress } from "@mui/material";
import styles from "./Loading.module.css";
const Loading = () => {
  return (
    <div className={styles["grid"]}>
      <img alt="icon" src="./assets/icon.png" /> <CircularProgress size={16} />
    </div>
  );
};

export default Loading;
