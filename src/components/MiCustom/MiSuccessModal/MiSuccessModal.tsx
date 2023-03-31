import { useEffect, useState } from "react";

import { Stack } from "@mui/system";
import styles from "./MiModalLayout.module.css";
import CloseIcon from "@mui/icons-material/Close";

const MiSuccessModal = (props: any) => {
  const { closeModal, title, subtitle } = props;

  return (
    <div className={styles["modal-wrapper"]}>
      <Stack spacing={2}>
        <Stack alignItems="flex-end">
          <CloseIcon onClick={closeModal} />
        </Stack>
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <img src="./assets/completed.svg" />
          <h6>{title}</h6>
          <p>{subtitle}</p>
        </Stack>
      </Stack>
    </div>
  );
};

export default MiSuccessModal;
