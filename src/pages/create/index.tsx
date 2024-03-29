import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Create.module.css";
import Dialog from "../../components/dialog";
import WalletSelect from "../../components/walletSelect";
import GraceSelect from "../../components/gracePeriod";
import AddressSelect from "../../components/addressSelect";
import { useFormik, getIn } from "formik";

import { CSSTransition } from "react-transition-group";

import * as RPC from "../../minima/libs/RPC";
import * as yup from "yup";
import Tooltip from "../../components/tooltip";
import { appContext } from "../../AppContext";
import { MinimaToken } from "../../@types";
import { DateTimePicker } from "@mui/x-date-pickers";
import { isDate } from "date-fns";
import FadeIn from "../../components/UI/Animations/FadeIn";
import SlideIn from "../../components/UI/Animations/SlideIn";
import Review from "../review";

const Create = () => {
  const {
    walletBalance: wallet,
    vaultLocked,
    scriptAddress,
  } = useContext(appContext);
  const location = useLocation();
  const navigate = useNavigate();
  const customStartInputRef: RefObject<HTMLInputElement> = useRef(null);
  const customEndInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [exit, setExit] = useState(false);

  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [dateTimePickerConstraintsOnCliff, setDateTimePickerConstraintOnCliff] =
    useState<Date | null>(null);

  const [review, setReview] = useState(false);

  const [tooltips, setTooltips] = useState({
    walletAddress: false,
    contractID: false,
    tokenAmount: false,
    start: false,
    end: false,
    cliffPeriod: false,
    gracePeriod: false,
  });

  const handleCancel = () => {
    navigate("/dashboard/creator");
  };
  const handleReviewClick = async () => {
    const uniqueIdentityForContract = await RPC.hash(
      encodeURIComponent(formik.values.name) + Math.random() * 1000000
    );
    formik.setFieldValue("uid", uniqueIdentityForContract);

    setReview(true);
  };

  const formik = useFormik({
    initialValues:
      location.state && "contract" in location.state
        ? { ...location.state.contract }
        : {
            token: {
              current: "0x00",
              selected: wallet[0],
            },
            grace: 24,
            amount: 0,
            start: null, // start date
            end: null, // end date
            name: "",
            address: {
              preference: null,
              hex: "",
            },
            uid: "",
            password: "",
          },
    onSubmit: async (form) => {
      await RPC.createVestingContract(
        form.amount.toString(),
        form.address.hex,
        form.token.selected,
        form.grace,
        form.uid,
        scriptAddress,

        form.password,

        form.start!,
        form.end!
      )
        .then((response) => {
          setReview(false);
          formik.setStatus(response);
        })
        .catch((error) => {
          const noCoinsAvailable = error.includes("No Coins of tokenid");
          const insufficientFunds = error.includes("Insufficient funds");

          if (noCoinsAvailable) {
            return formik.setStatus("Not enough coins available.  Top up?");
          }

          if (insufficientFunds) {
            return formik.setStatus(
              "Sorry, insufficient funds.  You require more tokens."
            );
          }

          return formik.setStatus(error);
        });
    },
    validationSchema: formValidationSelector(vaultLocked),
  });

  useEffect(() => {
    formik.setFieldValue(
      "token.selected",
      wallet.find((t: MinimaToken) => t.tokenid === formik.values.token.current)
    );
  }, [wallet]);

  const exitingContract = !!exit;

  return (
    <>
      {formik.status !== undefined && [0, 1].includes(formik.status) && (
        <FadeIn delay={0}>
          <div className={styles["transaction-status"]}>
            <div />
            <div className={styles["content"]}>
              <div>
                {formik.status === 1 && <h6>Pending</h6>}
                {formik.status === 0 && <h6>Confirmed</h6>}

                {formik.status === 1 && (
                  <p>
                    To complete this transaction, navigate to the Pending
                    MiniDapp in your minihub and accept this action.
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
            <div />
          </div>
        </FadeIn>
      )}

      {!!exitingContract && (
        <FadeIn delay={0}>
          <Dialog
            title="Exit this contract?"
            subtitle={
              <p className={styles["changes"]}>
                Your changes will not be saved
              </p>
            }
            buttonTitle="Exit this contract"
            dismiss={true}
            primaryButtonAction={handleCancel}
            cancelAction={() => setExit(false)}
          />
        </FadeIn>
      )}

      {review && (
        <Review
          submitForm={formik.handleSubmit}
          formStatus={formik.status}
          isSubmitting={formik.isSubmitting}
          clearForm={() => formik.setStatus(undefined)}
          contract={formik.values}
          closeReview={() => setReview(false)}
        />
      )}

      {!exitingContract && !review && (
        <FadeIn delay={0}>
          <section className={styles["grid"]}>
            <section>
              <button type="button" onClick={() => setExit(true)}>
                Cancel
              </button>

              <WalletSelect
                currentToken={formik.values.token.selected}
                setFormToken={(token: MinimaToken) => {
                  formik.setFieldValue("token.current", token.tokenid);
                  formik.setFieldValue("token.selected", token);
                }}
              />

              {Boolean(getIn(formik.errors, "token.selected")) &&
                Boolean(getIn(formik.touched, "token.selected")) && (
                  <FadeIn delay={0}>
                    <div className={styles["formError"]}>
                      {getIn(formik.errors, "token.selected")}
                    </div>
                  </FadeIn>
                )}
              <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                <label htmlFor="radio" className={styles["form-group-custom"]}>
                  Withdrawal address
                  <AddressSelect
                    currentSelection={formik.values.address}
                    setFormValue={(address: string, preference: string) => {
                      formik.setFieldValue("address.preference", preference);
                      formik.setFieldValue("address.hex", address);
                    }}
                  />
                </label>
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

                  {tooltips.walletAddress && (
                    <FadeIn delay={0}>
                      <Tooltip
                        content="The wallet address tokens will be sent to."
                        position={126}
                      />
                    </FadeIn>
                  )}

                  <input
                    id="address.hex"
                    disabled={formik.values.address.preference === null}
                    name="address.hex"
                    placeholder="Wallet address"
                    value={formik.values.address.hex}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {(Boolean(getIn(formik.errors, "address.hex")) &&
                    Boolean(getIn(formik.touched, "address.hex"))) ||
                    (Boolean(getIn(formik.errors, "address.preference")) &&
                      Boolean(getIn(formik.touched, "address.preference")) && (
                        <div className={styles["formError"]}>
                          {getIn(formik.errors, "address.hex")} <br />
                          {getIn(formik.errors, "address.preference")}
                        </div>
                      ))}
                </div>

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

                  {tooltips.tokenAmount && (
                    <FadeIn delay={0}>
                      <Tooltip
                        content="The total number of tokens to be vested."
                        position={119}
                      />
                    </FadeIn>
                  )}

                  <input
                    placeholder="Token amount"
                    type="number"
                    id="amount"
                    name="amount"
                    value={formik.values.amount > 0 ? formik.values.amount : ""}
                    onChange={formik.handleChange}
                  />

                  {Boolean(formik.errors.amount) &&
                    Boolean(formik.touched.amount) && (
                      <div className={styles["formError"]}>
                        {getIn(formik.errors, "amount")}
                      </div>
                    )}
                </div>

                <div className={styles["form-group"]}>
                  <span>
                    Contract start date/time
                    {!tooltips.start && (
                      <img
                        onClick={() =>
                          setTooltips({ ...tooltips, start: true })
                        }
                        alt="question"
                        src="./assets/help_filled.svg"
                      />
                    )}
                    {!!tooltips.start && (
                      <img
                        onClick={() =>
                          setTooltips({ ...tooltips, start: false })
                        }
                        alt="question"
                        src="./assets/cancel_filled.svg"
                      />
                    )}
                  </span>

                  {tooltips.start && (
                    <Tooltip
                      content="The amount of time before a contract starts."
                      position={208}
                    />
                  )}

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
                            onBlur={formik.handleBlur}
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
                  {Boolean(formik.errors.start) &&
                    Boolean(formik.touched.start) && (
                      <FadeIn delay={0}>
                        <div className={styles["formError"]}>
                          {formik.errors.start as string}
                        </div>
                      </FadeIn>
                    )}
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
                  {tooltips.end && (
                    <FadeIn delay={0}>
                      <Tooltip
                        content="The number of months the contract lasts."
                        position={199}
                      />
                    </FadeIn>
                  )}

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
                            onBlur={formik.handleBlur}
                            disabled={disabled}
                            placeholder="Select contract end"
                            ref={customEndInputRef}
                            {...inputProps}
                          />
                        </div>
                      );
                    }}
                  />
                  {Boolean(formik.errors.end) &&
                    Boolean(formik.touched.end) && (
                      <FadeIn delay={0}>
                        <div className={styles["formError"]}>
                          {getIn(formik.errors, "end")}
                        </div>
                      </FadeIn>
                    )}
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
                  {tooltips.gracePeriod && (
                    <FadeIn delay={0}>
                      <Tooltip
                        content="The amount of time between each collection. Please note, if you do not set a grace period, the recipient will be able to collect tokens after every block."
                        position={110}
                      />
                    </FadeIn>
                  )}

                  <GraceSelect
                    currentValue={formik.values.grace}
                    setFormValue={(value: number) =>
                      formik.setFieldValue("grace", value)
                    }
                  />
                  {Boolean(formik.errors.grace) &&
                    Boolean(formik.touched.grace) && (
                      <FadeIn delay={0}>
                        <div className={styles["formError"]}>
                          {getIn(formik.errors, "grace")}
                        </div>
                      </FadeIn>
                    )}
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
                    {Boolean(formik.errors.password) &&
                      Boolean(formik.touched.password) && (
                        <FadeIn delay={0}>
                          <div className={styles["formError"]}>
                            {getIn(formik.errors, "password")}
                          </div>
                        </FadeIn>
                      )}
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
        </FadeIn>
      )}
    </>
  );
};

export default Create;

const formValidationSelector = (vaultLocked: boolean) => {
  return yup.object().shape({
    token: yup.object().shape({
      current: yup.string().required(),
      selected: yup.object().required("Please select a token"),
    }),
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
    address: yup.object().shape({
      hex: yup
        .string()
        .required("Please enter an address.")
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
      preference: yup
        .string()
        .required("Please select your preference for an address."),
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
