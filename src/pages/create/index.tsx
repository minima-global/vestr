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

import { CSSTransition } from "react-transition-group";

import * as RPC from "../../minima/libs/RPC";
import * as yup from "yup";
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
    if (location.state && location.state.cliff) {
      console.log("Setting field Value For Cliff");
      formik.setFieldValue("cliff", location.state.cliff);
    }
  }, [location.state && location.state.cliff ? location.state.cliff : ""]);

  useEffect(() => {
    formik.setFieldValue(
      "token",
      location.state && location.state.tokenid
        ? wallet.find((t) => t.tokenid === location.state.tokenid)
        : wallet[0]
    );
  }, [
    location.state && location.state.tokenid ? location.state.tokenid : "",
    wallet,
  ]);

  useEffect(() => {
    if (location.state && location.state.grace) {
      formik.setFieldValue(
        "grace",
        location.state.grace[Object.keys(location.state.grace)[0]]
      );
    }
  }, [location.state && location.state.grace ? location.state.grace : ""]);

  useEffect(() => {
    if (location.state && location.state.addressPreference) {
      const own = location.state.addressPreference === "0";
      if (own) {
        formik.setFieldValue("address", walletAddress);
      }
    }
  }, [
    location.state && location.state.addressPreference
      ? location.state.addressPreference
      : "",
  ]);

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
    validationSchema: formValidation,
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
          <CSSTransition
            in={formik.errors.token && formik.touched.token ? true : false}
            unmountOnExit
            timeout={200}
            classNames={{
              enter: styles.backdropEnter,
              enterDone: styles.backdropEnterActive,
              exit: styles.backdropExit,
              exitActive: styles.backdropExitActive,
            }}
          >
            <div className={styles["formError"]}>{formik.errors.token}</div>
          </CSSTransition>
        </section>

        <section>
          <form onSubmit={formik.handleSubmit} className={styles["form"]}>
            <label htmlFor="radio" className={styles["form-group-custom"]}>
              Withdrawal address
              <AddressSelect />
            </label>
            {location.state && location.state.addressPreference && (
              <label htmlFor="address" className={styles["form-group"]}>
                Withdrawal address
                <input
                  id="address"
                  name="address"
                  placeholder="Wallet address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <CSSTransition
                  in={
                    formik.errors.address && formik.touched.address
                      ? true
                      : false
                  }
                  unmountOnExit
                  timeout={200}
                  classNames={{
                    enter: styles.backdropEnter,
                    enterDone: styles.backdropEnterActive,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                  }}
                >
                  <div className={styles["formError"]}>
                    {formik.errors.address}
                  </div>
                </CSSTransition>
              </label>
            )}

            <label htmlFor="name" className={styles["form-group"]}>
              Contract ID
              <input
                placeholder="Contract name"
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <CSSTransition
                in={formik.errors.name && formik.touched.name ? true : false}
                unmountOnExit
                timeout={200}
                classNames={{
                  enter: styles.backdropEnter,
                  enterDone: styles.backdropEnterActive,
                  exit: styles.backdropExit,
                  exitActive: styles.backdropExitActive,
                }}
              >
                <div className={styles["formError"]}>{formik.errors.name}</div>
              </CSSTransition>
            </label>

            <label htmlFor="amount" className={styles["form-group"]}>
              Token amount
              <input
                placeholder="Token amount"
                type="number"
                id="amount"
                name="amount"
                value={formik.values.amount > 0 ? formik.values.amount : ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <CSSTransition
                in={
                  formik.errors.amount && formik.touched.amount ? true : false
                }
                unmountOnExit
                timeout={200}
                classNames={{
                  enter: styles.backdropEnter,
                  enterDone: styles.backdropEnterActive,
                  exit: styles.backdropExit,
                  exitActive: styles.backdropExitActive,
                }}
              >
                <div className={styles["formError"]}>
                  {formik.errors.amount}
                </div>
              </CSSTransition>
            </label>

            <label htmlFor="length" className={styles["form-group"]}>
              Contract length
              <input
                placeholder="Contract length"
                type="number"
                id="length"
                name="length"
                value={formik.values.length > 0 ? formik.values.length : ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <CSSTransition
                in={
                  formik.errors.length && formik.touched.length ? true : false
                }
                unmountOnExit
                timeout={200}
                classNames={{
                  enter: styles.backdropEnter,
                  enterDone: styles.backdropEnterActive,
                  exit: styles.backdropExit,
                  exitActive: styles.backdropExitActive,
                }}
              >
                <div className={styles["formError"]}>
                  {formik.errors.length}
                </div>
              </CSSTransition>
            </label>

            <label htmlFor="Cliff period" className={styles["form-group"]}>
              Cliff period
              <CliffSelect />
              <CSSTransition
                in={formik.errors.cliff && formik.touched.cliff ? true : false}
                unmountOnExit
                timeout={200}
                classNames={{
                  enter: styles.backdropEnter,
                  enterDone: styles.backdropEnterActive,
                  exit: styles.backdropExit,
                  exitActive: styles.backdropExitActive,
                }}
              >
                <div className={styles["formError"]}>{formik.errors.cliff}</div>
              </CSSTransition>
            </label>

            <label className={styles["form-group"]}>
              Grace period
              <GraceSelect />
              <CSSTransition
                in={formik.errors.grace ? true : false}
                unmountOnExit
                timeout={200}
                classNames={{
                  enter: styles.backdropEnter,
                  enterDone: styles.backdropEnterActive,
                  exit: styles.backdropExit,
                  exitActive: styles.backdropExitActive,
                }}
              >
                <div className={styles["formError"]}>{formik.errors.grace}</div>
              </CSSTransition>
            </label>

            <button disabled={!formik.isValid} type="submit">
              Review
            </button>
          </form>
        </section>
      </section>
    </>
  );
};

export default Create;

const formValidation = yup.object().shape({
  token: yup.object().required("Field is required"),
  amount: yup.number().required("Field is required"),
  cliff: yup.number().test("cliff", "Invalid cliff period", function (val) {
    const { path, createError, parent } = this;
    if (val === undefined) return true;
    console.log(parent);
    const contractLength = parent.length;

    if (typeof contractLength !== "number" || contractLength === 0) return true;
    console.log("Comparing cliff with val", val);

    const invalidCliffAmount = val >= contractLength;
    if (invalidCliffAmount) {
      return createError({
        path,
        message: "Cliff period must be less than the contract length",
      });
    }

    return true;
  }),
  grace: yup.number().test("grace", "Invalid grace period", function (val) {
    const { path, createError, parent } = this;
    if (val === undefined) return true;

    const contractLength = parent.length;

    if (typeof contractLength !== "number" || contractLength === 0) return true;
    console.log("Comparing grace with val", val);
    const invalidGracePeriod = val >= contractLength * 168 * 4;
    if (invalidGracePeriod) {
      return createError({
        path,
        message: "Grace period must be less than the contract length",
      });
    }

    return true;
  }),
  length: yup
    .number()
    .required("Field is required")
    .test("check-month", "Invalid month", function (val) {
      const { path, createError, parent } = this;
      if (val === undefined) {
        return false;
      }

      if (val < 1) {
        return createError({
          path,
          message: "Please select a valid amount of month(s)",
        });
      }

      return true;
    }),
  name: yup
    .string()
    .max(255, "Contract name must be at most 255 characters")
    .matches(/^[^\\;]+$/, "Invalid characters"),
  address: yup
    .string()
    .required("Field is required")
    .matches(/0|M[xX][0-9a-zA-Z]+/, "Invalid Address.")
    .min(59, "Invalid Address, too short.")
    .max(66, "Invalid Address, too long.")
    .test("check-address", "Invalid address", function (val) {
      const { path, createError } = this;

      if (val === undefined) {
        return false;
      }

      return RPC.checkAddress(val)
        .then(() => {
          return true;
        })
        .catch((err) => {
          return createError({ path, message: err });
        });
    }),
});
