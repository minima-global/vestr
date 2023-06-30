import SlideIn from "../UI/SlideIn";
import styles from "./VaultDialog.module.css";

interface IProps {
  submitForm: () => void;
}
const VaultDialog = ({ submitForm }: IProps) => {
  return (
    <SlideIn display={true} timeout={500}>
      <div className={styles["backdrop"]}>
        <div />
        <div className={styles["dialog"]}>
          <h6>Your node is locked</h6>
          <p>Enter your password to continue with this transaction.</p>

          <input />

          <button></button>
        </div>
        <div />
      </div>
    </SlideIn>
  );
};

export default VaultDialog;
