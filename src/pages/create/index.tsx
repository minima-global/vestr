import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Create.module.css";
import Dialog from "../../components/dialog";
import useWalletBalance from "../../hooks/useWalletBalance";
import WalletSelect from "../../components/walletSelect";
import GraceSelect from "../../components/gracePeriod";
import CliffSelect from "../../components/cliffPeriod";
import AddressSelect from "../../components/addressSelect";
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
          <form className={styles["form"]}>
            <div>
              <label htmlFor="radio" className={styles["form-group-custom"]}>
                Withdrawal address
                <AddressSelect />
              </label>
            </div>

            <label htmlFor="contract-id" className={styles["form-group"]}>
              Contract ID
              <input
                placeholder="Contract name"
                type="text"
                id="contract-id"
                name="contract-id"
              />
            </label>

            <label htmlFor="amount" className={styles["form-group"]}>
              Token amount
              <input
                placeholder="Token amount"
                type="number"
                id="amount"
                name="amount"
              />
            </label>

            <label htmlFor="contract-length" className={styles["form-group"]}>
              Contract length
              <input
                placeholder="Contract length"
                type="amount"
                id="contract-length"
                name="contract-length"
              />
            </label>

            <label htmlFor="Cliff period" className={styles["form-group"]}>
              Cliff period
              <CliffSelect />
            </label>

            <label className={styles["form-group"]}>
              Grace period
              <GraceSelect />
            </label>

            <button type="submit">Review</button>
          </form>
        </section>
      </section>
    </>
  );
};

export default Create;
