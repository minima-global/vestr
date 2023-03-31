import { Stack, Toolbar } from "@mui/material";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <Stack className={styles["notfound"]}>
      <Toolbar />
      <Stack className={styles["content"]}>
        <h6>Page Not Found</h6>
      </Stack>
    </Stack>
  );
};

export default NotFound;
