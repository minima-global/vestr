import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, matchPath, useNavigate } from "react-router-dom";
import styles from "./Create.module.css";
import Dialog from "../../components/dialog";
import WalletSelect from "../../components/walletSelect";
import GraceSelect, { gracePeriods } from "../../components/gracePeriod";
import CliffSelect from "../../components/cliffPeriod";
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

const Create = () => {
  const { walletBalance: wallet, scriptAddress } = useContext(appContext);
  const { walletAddress } = useWalletAddress();
  const location = useLocation();
  const navigate = useNavigate();
  const [exit, setExit] = useState(false);
  const [review, setReview] = useState(false);
  const isMobile = useMobileView();
  // console.log(wallet);
  const [tooltips, setTooltips] = useState({
    walletAddress: false,
    contractID: false,
    tokenAmount: false,
    contractLength: false,
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
    if (location.state && location.state.cliff) {
      formik.setFieldValue("cliff", location.state.cliff, true);
    }
  }, [location.state && location.state.cliff ? location.state.cliff : ""]);

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

  const formik = useFormik({
    initialValues: {
      token: wallet[0],
      cliff: 0,
      grace: 0,
      amount: 0,
      length: 0,
      name: "",
      address: "",
      uid: "",
    },
    onSubmit: async (form) => {
      if (!form.token) throw new Error("You must select a token first");
      try {
        const transactionStatus: 0 | 1 = await RPC.createVestingContract(
          form.amount.toString(),
          form.cliff,
          form.address,
          form.token,
          form.length,
          form.grace,
          form.name,
          form.uid,
          scriptAddress
        ).catch((err) => {
          throw new Error(err);
        });

        formik.setStatus(transactionStatus);
      } catch (error: any) {
        // console.log("Error transaction creation", error.message);

        const noCoinsAvailable = error.message.includes("No Coins of tokenid");
        const insufficientFunds = error.message.includes("Insufficient funds");
        formik.setStatus(
          noCoinsAvailable
            ? "Not enough coins available."
            : insufficientFunds
            ? "Insufficient funds, you require more tokens."
            : error.message
        );
      }
    },
    validationSchema: formValidation,
  });

  // console.log("formik errors", formik.errors);
  // console.log("token ", formik.values.token);

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
            <h6>Confirm</h6>

            {isMobile && formik.status === 1 && (
              <p>
                To complete the transaction, go to the Minima app <br /> Home
                screen, press <img alt="pending" src="./assets/pace.svg" /> ,
                then <br /> long press the Vestr command and <br /> select
                'Accept'.
              </p>
            )}
            {!isMobile && formik.status === 1 && (
              <p>
                To complete this transaction, open your Minihub and <br /> find
                the pending transaction in the 'Pending Actions' button in the
                header.
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
                </div>
              )}

              {/* <label htmlFor="name" className={styles["form-group"]}>
                <span>
                  Contract name
                  {!tooltips.contractID && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, contractID: true })
                      }
                      alt="question"
                      src="./assets/help_filled.svg"
                    />
                  )}
                  {!!tooltips.contractID && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, contractID: false })
                      }
                      alt="question"
                      src="./assets/cancel_filled.svg"
                    />
                  )}
                </span>
                <CSSTransition
                  in={tooltips.contractID}
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
                    content="A name for your contract so you can easily identify it."
                    position={98}
                  />
                </CSSTransition>
                <input
                  placeholder="Contract name"
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
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
                  <div className={styles["formError"]}>
                    {formik.errors.name}
                  </div>
                </CSSTransition>
              </label> */}

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
              </div>

              <div className={styles["form-group"]}>
                <span>
                  Contract length
                  {!tooltips.contractLength && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, contractLength: true })
                      }
                      alt="question"
                      src="./assets/help_filled.svg"
                    />
                  )}
                  {!!tooltips.contractLength && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, contractLength: false })
                      }
                      alt="question"
                      src="./assets/cancel_filled.svg"
                    />
                  )}
                </span>
                <CSSTransition
                  in={tooltips.contractLength}
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
                    position={136}
                  />
                </CSSTransition>

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
              </div>

              <div className={styles["form-group"]}>
                <span>
                  Cliff period
                  {!tooltips.cliffPeriod && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, cliffPeriod: true })
                      }
                      alt="question"
                      src="./assets/help_filled.svg"
                    />
                  )}
                  {!!tooltips.cliffPeriod && (
                    <img
                      onClick={() =>
                        setTooltips({ ...tooltips, cliffPeriod: false })
                      }
                      alt="question"
                      src="./assets/cancel_filled.svg"
                    />
                  )}
                </span>
                <CSSTransition
                  in={tooltips.cliffPeriod}
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
                    position={96}
                  />
                </CSSTransition>
                <CliffSelect />
                <CSSTransition
                  in={Boolean(formik.errors.cliff)}
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
                    {formik.errors.cliff as string}
                  </div>
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

const formValidation = yup.object().shape({
  token: yup.object().required("Field is required"),
  amount: yup.number().required("Field is required"),
  cliff: yup.number().test("cliff", function (val) {
    const { path, createError, parent } = this;
    if (val === undefined) return true;

    const contractLength = parent.length;

    // if (typeof contractLength !== "number" || contractLength === 0) return true;

    const invalidCliffAmount = val >= contractLength;
    if (invalidCliffAmount && Number(contractLength)) {
      return createError({
        path,
        message: "Cliff period must be less than the contract length",
      });
    }

    return true;
  }),
  grace: yup.number().test("grace", function (val) {
    const { path, createError, parent } = this;
    if (val === undefined) return true;

    const contractLength = parent.length;

    const invalidGracePeriod = val >= contractLength * 168 * 4;
    if (invalidGracePeriod && Number(contractLength)) {
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
    .test("contract-length", function (val) {
      const { path, createError } = this;

      if (val === undefined) {
        return createError({ path, message: "Please select a length" });
      }
      if (val < 1) {
        return createError({ path, message: "Please select a valid length" });
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
