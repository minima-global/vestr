import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Create.module.css";
import Dialog from "../../components/dialog";
import WalletSelect from "../../components/walletSelect";
import GraceSelect from "../../components/gracePeriod";
import CliffSelect from "../../components/cliffPeriod";
import AddressSelect from "../../components/addressSelect";
import { useFormik } from "formik";
import useWalletBalance from "../../hooks/useWalletBalance";
import useWalletAddress from "../../hooks/useWalletAddress";

import * as RPC from "../../minima/libs/RPC";
const Create = () => {
  const { balance: wallet } = useWalletBalance();
  const { walletAddress } = useWalletAddress();
  const location = useLocation();
  const navigate = useNavigate();
  const [exit, setExit] = useState(false);
  const handleCancel = () => {
    navigate("/dashboard/creator");
  };

  useEffect(() => {
    console.log(location.state);
    formik.setFieldValue(
      "token",
      location.state && location.state.tokenid
        ? wallet.find((t) => t.tokenid === location.state.tokenid)
        : wallet[0]
    );
    if (location.state && location.state.cliff) {
      formik.setFieldValue("cliff", location.state.cliff);
    }
    if (location.state && location.state.grace) {
      formik.setFieldValue("grace", location.state.grace);
    }
    if (location.state && location.state.addressPreference) {
      const own = location.state.addressPreference === "0";
      if (own) {
        formik.setFieldValue("address", walletAddress);
      }
    }
  }, [location, wallet]);

  const formik = useFormik({
    initialValues: {
      token:
        location.state && location.state.tokenid
          ? wallet.find((t) => t.tokenid === location.state.tokenid)
          : wallet[0],
      cliff: 0,
      grace: 0,
      amount: 0,
      length: 0,
      name: "",
      address: "",
    },
    onSubmit: async (form) => {
      console.log("token", form);

      try {
        // await RPC.createVestingContract();
      } catch (error) {}
    },
  });

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
          <form onSubmit={formik.handleSubmit} className={styles["form"]}>
            <label htmlFor="radio" className={styles["form-group-custom"]}>
              Withdrawal address
              <AddressSelect />
            </label>
            {location.state && location.state.addressPreference && (
              <label htmlFor="wallet" className={styles["form-group"]}>
                Withdrawal address
                <input
                  id="wallet"
                  name="wallet"
                  placeholder="Wallet address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </label>
            )}

            <label htmlFor="contract-id" className={styles["form-group"]}>
              Contract ID
              <input
                placeholder="Contract name"
                type="text"
                id="contract-id"
                name="contract-id"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>

            <label htmlFor="amount" className={styles["form-group"]}>
              Token amount
              <input
                placeholder="Token amount"
                type="number"
                id="amount"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </label>

            <label htmlFor="contract-length" className={styles["form-group"]}>
              Contract length
              <input
                placeholder="Contract length"
                type="amount"
                id="contract-length"
                name="contract-length"
                value={formik.values.length}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
