import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, matchPath, useNavigate } from "react-router-dom";
import styles from "./Create.module.css";
import Dialog from "../../components/dialog";
import WalletSelect from "../../components/walletSelect";
import GraceSelect, { gracePeriods } from "../../components/gracePeriod";
import AddressSelect from "../../components/addressSelect";
import { useFormik } from "formik";
import useWalletAddress from "../../hooks/useWalletAddress";

import { CSSTransition } from "react-transition-group";

import * as RPC from "../../minima/libs/RPC";
import * as yup from "yup";
import Tooltip from "../../components/tooltip";
import { appContext } from "../../AppContext";
import { MinimaToken } from "../../@types";
import useMobileView from "../../hooks/useMobileView";
import { DateTimePicker } from "@mui/x-date-pickers";
import { isDate } from "date-fns";

const Create = () => {
  const {
    walletBalance: wallet,
    vaultLocked,
    scriptAddress,
  } = useContext(appContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobileView();
  const customStartInputRef: RefObject<HTMLInputElement> = useRef(null);
  const customEndInputRef: RefObject<HTMLInputElement> = useRef(null);

  const { walletAddress } = useWalletAddress();

  const [exit, setExit] = useState(false);
  const [review, setReview] = useState(false);

  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [openStartPicker, setOpenStartPicker] = useState(false);

  const [dateTimePickerConstraintsOnCliff, setDateTimePickerConstraintOnCliff] =
    useState<Date | null>(null);

  const [tooltips, setTooltips] = useState({
    walletAddress: false,
    contractID: false,
    tokenAmount: false,
    start: false,
    end: false,
    cliffPeriod: false,
    gracePeriod: false,
  });

  const reviewPath = matchPath(
    { path: "/dashboard/creator/create/review/:id" },
    location.pathname
  );

  const createPath = matchPath(
    { path: "/dashboard/creator/create" },
    location.pathname
  );
  const handleCancel = () => {
    navigate("/dashboard/creator");
  };
  const handleReviewClick = async () => {
    setReview(true);
    const uniqueIdentityForContract = await RPC.hash(
      encodeURIComponent(formik.values.name) + Math.random() * 1000000
    );
    formik.setFieldValue("uid", uniqueIdentityForContract);

    setReview(false);

    navigate("review/" + uniqueIdentityForContract, {
      state: {
        contract: {
          ...formik.values,
          id: uniqueIdentityForContract,
        },
      },
    });
  };

  useEffect(() => {
    formik.setFieldValue(
      "token",
      location.state && location.state.tokenid
        ? wallet.find((t: MinimaToken) => t.tokenid === location.state.tokenid)
        : wallet[0],
      true
    );
  }, [wallet]);

  useEffect(() => {
    if (location.state && location.state.grace) {
      formik.setFieldValue(
        "grace",
        gracePeriods[location.state.grace.replaceAll(" ", "_")],
        true
      );
    }
  }, [location.state && location.state.grace ? location.state.grace : ""]);

  useEffect(() => {
    if (location.state && location.state.addressPreference) {
      const own = location.state.addressPreference === "0";
      if (own) {
        formik.setFieldValue("address", walletAddress, true);
      }

      if (!own) {
        formik.setFieldValue("address", "");
      }
    }
  }, [
    location.state && location.state.addressPreference
      ? location.state.addressPreference
      : "",
  ]);

  // @ts-ignore
  const formik = useFormik({
    initialValues: {
      token: wallet[0],
      grace: 0,
      amount: 0,
      start: undefined, // start date
      end: undefined, // end date
      name: "",
      address: "",
      uid: "",
      password: "",
    },
    onSubmit: async (form) => {
      const transactionStatus = await RPC.createVestingContract(
        form.amount.toString(),
        form.address,
        form.token,
        form.grace,
        form.uid,
        scriptAddress,

        form.password,

        form.start!,
        form.end!
      ).catch((error) => {
        const noCoinsAvailable = error.message.includes("No Coins of tokenid");
        const insufficientFunds = error.message.includes("Insufficient funds");

        if (noCoinsAvailable) {
          return formik.setStatus("Not enough coins available.  Top up?");
        }

        if (insufficientFunds) {
          return formik.setStatus(
            "Sorry, insufficient funds.  You require more tokens."
          );
        }

        return formik.setStatus("Sorry, try again later.");
      });

      return formik.setStatus(transactionStatus);
    },
    validationSchema: formValidationSelector(vaultLocked),
  });

  return (
    <>
      <CSSTransition
        in={
          typeof formik.status !== "undefined" &&
          (formik.status === 0 || formik.status === 1)
        }
        timeout={200}
        unmountOnExit
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
        <div className={styles["transaction-status"]}>
          <div>
            <h6>{formik.status === 1 ? "Pending" : "Confirmed"}</h6>

            {formik.status === 1 && (
              <p>
                To complete this transaction, navigate to the Pending MiniDapp
                in your minihub and accept this action.
              </p>
            )}

            {formik.status === 0 && (
              <p>Transaction was completed and should arrive shortly.</p>
            )}
          </div>
          <button
            onClick={() => {
              navigate("/dashboard/creator/create");
              formik.resetForm();
            }}
            type="button"
          >
            Continue
          </button>
        </div>
      </CSSTransition>
      <CSSTransition
        in={!Boolean(createPath) && Boolean(reviewPath)}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
        <Outlet
          context={{
            submitForm: formik.handleSubmit,
            formStatus: formik.status,
            isSubmitting: formik.isSubmitting,
            clearForm: () => formik.setStatus(undefined),
          }}
        />
      </CSSTransition>
      <CSSTransition
        in={exit}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
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
      </CSSTransition>
      <CSSTransition
        in={Boolean(createPath) && !Boolean(reviewPath)}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
        <section className={styles["grid"]}>
          <section>
            <button type="button" onClick={() => setExit(true)}>
              Cancel
            </button>

            <WalletSelect />
            <CSSTransition
              in={Boolean(formik.errors.token) && Boolean(formik.touched.token)}
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
                {formik.errors.token as string}
              </div>
            </CSSTransition>
          </section>

          <section>
            <form onSubmit={formik.handleSubmit} className={styles["form"]}>
              <label htmlFor="radio" className={styles["form-group-custom"]}>
                Withdrawal address
                <AddressSelect />
              </label>
              {location.state && location.state.addressPreference && (
                <div className={styles["form-group"]}>
                  <span>
                    Wallet address
                    {!tooltips.walletAddress && (
                      <img
                        onClick={() =>
                          setTooltips({ ...tooltips, walletAddress: true })
                        }
                        alt="question"
                        src="./assets/help_filled.svg"
                      />
                    )}
                    {!!tooltips.walletAddress && (
                      <img
                        onClick={() =>
                          setTooltips({ ...tooltips, walletAddress: false })
                        }
                        alt="question"
                        src="./assets/cancel_filled.svg"
                      />
                    )}
                  </span>

                  <CSSTransition
                    in={tooltips.walletAddress}
                    unmountOnExit
                    timeout={200}
                    classNames={{
                      enter: styles.backdropEnter,
                      enterDone: styles.backdropEnterActive,
                      exit: styles.backdropExit,
                      exitActive: styles.backdropExitActive,
                    }}
                  >
                    <Tooltip
                      content="The wallet address tokens will be sent to."
                      position={126}
                    />
                  </CSSTransition>

                  <input
                    id="address"
                    name="address"
                    placeholder="Wallet address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                  <CSSTransition
                    in={formik.errors.address}
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
                </div>
              )}

              <div className={styles["form-group"]}>
                <span>
                  Token amount
                  {!tooltips.tokenAmount && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, tokenAmount: true })
                      }
                      alt="question"
                      src="./assets/help_filled.svg"
                    />
                  )}
                  {!!tooltips.tokenAmount && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, tokenAmount: false })
                      }
                      alt="question"
                      src="./assets/cancel_filled.svg"
                    />
                  )}
                </span>
                <CSSTransition
                  in={tooltips.tokenAmount}
                  unmountOnExit
                  timeout={200}
                  classNames={{
                    enter: styles.backdropEnter,
                    enterDone: styles.backdropEnterActive,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                  }}
                >
                  <Tooltip
                    content="The total number of tokens to be vested."
                    position={119}
                  />
                </CSSTransition>
                <input
                  placeholder="Token amount"
                  type="number"
                  id="amount"
                  name="amount"
                  value={formik.values.amount > 0 ? formik.values.amount : ""}
                  onChange={formik.handleChange}
                />
                <CSSTransition
                  in={formik.errors.amount}
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
              </div>

              <div className={styles["form-group"]}>
                <span>
                  Contract start date/time
                  {!tooltips.start && (
                    <img
                      onClick={() => setTooltips({ ...tooltips, start: true })}
                      alt="question"
                      src="./assets/help_filled.svg"
                    />
                  )}
                  {!!tooltips.start && (
                    <img
                      onClick={() => setTooltips({ ...tooltips, start: false })}
                      alt="question"
                      src="./assets/cancel_filled.svg"
                    />
                  )}
                </span>
                <CSSTransition
                  in={tooltips.start}
                  unmountOnExit
                  timeout={200}
                  classNames={{
                    enter: styles.backdropEnter,
                    enterDone: styles.backdropEnterActive,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                  }}
                >
                  <Tooltip
                    content="The amount of time before a contract starts."
                    position={208}
                  />
                </CSSTransition>
                <DateTimePicker
                  open={openStartPicker}
                  disablePast={true}
                  onOpen={() => setOpenStartPicker(true)}
                  minDateTime={new Date()}
                  value={formik.values.start}
                  PopperProps={{ anchorEl: customStartInputRef.current }}
                  onChange={(value) => {
                    formik.setFieldValue("start", value, true);
                    setDateTimePickerConstraintOnCliff(value);
                  }}
                  onClose={() => setOpenStartPicker(false)}
                  renderInput={({ ref, inputProps, disabled, onChange }) => {
                    return (
                      <div ref={ref}>
                        <input
                          id="start"
                          name="start"
                          className={styles["datetime-input"]}
                          onClick={() => setOpenStartPicker(true)}
                          value={formik.values.start}
                          onChange={onChange}
                          disabled={disabled}
                          placeholder="Select contract start"
                          ref={customStartInputRef}
                          {...inputProps}
                        />
                      </div>
                    );
                  }}
                />
                <CSSTransition
                  in={
                    Boolean(formik.errors.start) &&
                    Boolean(formik.touched.start)
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
                    {formik.errors.start as string}
                  </div>
                </CSSTransition>
              </div>

              <div className={styles["form-group"]}>
                <span>
                  Contract end date/time
                  {!tooltips.end && (
                    <img
                      onClick={() => setTooltips({ ...tooltips, end: true })}
                      alt="question"
                      src="./assets/help_filled.svg"
                    />
                  )}
                  {!!tooltips.end && (
                    <img
                      onClick={() => setTooltips({ ...tooltips, end: false })}
                      alt="question"
                      src="./assets/cancel_filled.svg"
                    />
                  )}
                </span>
                <CSSTransition
                  in={tooltips.end}
                  unmountOnExit
                  timeout={200}
                  classNames={{
                    enter: styles.backdropEnter,
                    enterDone: styles.backdropEnterActive,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                  }}
                >
                  <Tooltip
                    content="The number of months the contract lasts."
                    position={199}
                  />
                </CSSTransition>

                <DateTimePicker
                  open={openEndPicker}
                  disablePast={true}
                  onOpen={() => setOpenEndPicker(true)}
                  minDateTime={dateTimePickerConstraintsOnCliff}
                  value={formik.values.end}
                  PopperProps={{ anchorEl: customEndInputRef.current }}
                  onChange={(value) => {
                    formik.setFieldValue("end", value, true);
                  }}
                  onClose={() => setOpenEndPicker(false)}
                  renderInput={({ ref, inputProps, disabled, onChange }) => {
                    return (
                      <div ref={ref}>
                        <input
                          id="end"
                          name="end"
                          className={styles["datetime-input"]}
                          onClick={() => setOpenEndPicker(true)}
                          value={formik.values.end}
                          onChange={onChange}
                          disabled={disabled}
                          placeholder="Select contract end"
                          ref={customEndInputRef}
                          {...inputProps}
                        />
                      </div>
                    );
                  }}
                />
                <CSSTransition
                  in={formik.errors.end}
                  unmountOnExit
                  timeout={200}
                  classNames={{
                    enter: styles.backdropEnter,
                    enterDone: styles.backdropEnterActive,
                    exit: styles.bafckdropExit,
                    exitActive: styles.backdropExitActive,
                  }}
                >
                  <div className={styles["formError"]}>{formik.errors.end}</div>
                </CSSTransition>
              </div>

              <div className={styles["form-group"]}>
                <span>
                  Grace period
                  {!tooltips.gracePeriod && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, gracePeriod: true })
                      }
                      alt="question"
                      src="./assets/help_filled.svg"
                    />
                  )}
                  {!!tooltips.gracePeriod && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, gracePeriod: false })
                      }
                      alt="question"
                      src="./assets/cancel_filled.svg"
                    />
                  )}
                </span>
                <CSSTransition
                  in={tooltips.gracePeriod}
                  unmountOnExit
                  timeout={200}
                  classNames={{
                    enter: styles.backdropEnter,
                    enterDone: styles.backdropEnterActive,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                  }}
                >
                  <Tooltip
                    content="The amount of time between each collection. Please note, if you do not set a grace period, the recipient will be able to collect tokens after every block."
                    position={110}
                  />
                </CSSTransition>
                <GraceSelect />
                <CSSTransition
                  in={Boolean(formik.errors.grace)}
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
                    {formik.errors.grace}
                  </div>
                </CSSTransition>
              </div>

              {!!vaultLocked && (
                <div className={styles["form-group"]}>
                  <span>Vault password</span>

                  <input
                    placeholder="Vault password"
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <CSSTransition
                    in={formik.errors.password}
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
                      {formik.errors.password}
                    </div>
                  </CSSTransition>
                </div>
              )}

              <button
                disabled={!(formik.isValid && formik.dirty)}
                type="button"
                onClick={handleReviewClick}
              >
                Review
              </button>
            </form>
          </section>
        </section>
      </CSSTransition>
    </>
  );
};

export default Create;

const formValidationSelector = (vaultLocked: boolean) => {
  return yup.object().shape({
    token: yup.object().required("Field is required"),
    amount: yup.number().required("Field is required"),
    grace: yup.number().test("grace", function (val) {
      if (val === undefined) return true;

      return true;
    }),
    start: yup
      .date()
      .required("Field is required")
      .typeError("Select a valid date and time")
      .test("datetime-check", "Invalid date", function (val) {
        const { path, createError } = this;

        if (val === undefined) {
          return false;
        }

        if (!isDate(val)) {
          return createError({ path, message: "Please select a valid date" });
        }

        if (val <= new Date()) {
          return createError({
            path,
            message: "Please select a date in the future",
          });
        }

        return true;
      }),
    end: yup
      .date()
      .required("Field is required")
      .typeError("Select a valid date and time")
      .test("datetime-check", "Invalid date", function (val) {
        const { parent, path, createError } = this;

        if (val === undefined) {
          return false;
        }

        if (!isDate(val)) {
          return createError({ path, message: "Please select a valid date" });
        }

        if (parent.start >= val) {
          return createError({
            path,
            message: "Your contract can't end before it starts.",
          });
        }

        if (val <= new Date()) {
          return createError({
            path,
            message: "Please select a date in the future",
          });
        }

        return true;
      }),
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
    password: yup.string().test("check-password", function (val) {
      const { createError, path } = this;
      if (!vaultLocked) {
        return true;
      }

      if (vaultLocked && val === undefined) {
        return createError({
          path,
          message: "Please enter your vault password.",
        });
      }

      return true;
    }),
  });
};
