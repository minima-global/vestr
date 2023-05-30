import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Create.module.css";
import Dialog from "../../components/dialog";
import useWalletBalance from "../../hooks/useWalletBalance";
import WalletSelect from "../../components/walletSelect";
const Create = () => {
  const navigate = useNavigate();
  const [exit, setExit] = useState(false);
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <>
      {exit && (
        <Dialog
          title="Exit this contract?"
          subtitle={
            <p className={styles["changes"]}>Your changes will not be saved</p>
          }
          buttonTitle="Exit this contract"
          dismiss={true}
          primaryButtonAction={handleCancel}
          cancelAction={() => setExit(false)}
        />
      )}
      <section className={styles["grid"]}>
        <section>
          <button type="button" onClick={() => setExit(true)}>
            Cancel
          </button>

          <WalletSelect />
        </section>

        <section>
          <form>
            <div>
              <label>Withdrawal address</label>
              <input type="radio" />
              <input type="radio" />
            </div>

            <div>
              <label>Contract ID</label>
              <input type="text" />
            </div>

            <div>
              <label>Token amount</label>
              <input type="number" />
            </div>

            <div>
              <label>Contract length</label>
              <input type="select" />
            </div>

            <div>
              <label>Cliff period</label>
              <input type="select" />
            </div>

            <div>
              <label>Grace period</label>
              <input type="select" />
            </div>

            <button type="submit">Review</button>
          </form>
        </section>
      </section>
    </>
  );
};

export default Create;
