import { useState, useEffect } from "react";

import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";

import Select from "../MiCustom/Select";
import * as RPC from "../../minima/libs/RPC";

import MiError from "../MiCustom/MiError/MiError";
import * as yup from "yup";
import { checkAddress } from "../../minima/libs/RPC";
import useWalletBalance from "../../hooks/useWalletBalance";
import useWalletAddress from "../../hooks/useWalletAddress";
import {
  InputLabel,
  InputWrapper,
  InputWrapperRadio,
  InputHelper,
  InputPercentage,
} from "../InputWrapper/InputWrapper";
import OngoingTransaction from "../OngoingTransaction";

import styles from "./VestCreate.module.css";
import MiSelect from "../MiCustom/MiSelect/MiSelect";

const formValidation = yup.object().shape({
  id: yup
    .string()
    .max(255, "Contract name must be at most 255 characters")
    .matches(/^[^\\;]+$/, "Invalid characters"),
  token: yup.object().required("Field is required"),
  contractLength: yup
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
  amount: yup.number().required("Field is required"),
  address: yup
    .string()
    .required("Field is required.")
    .matches(/0|M[xX][0-9a-zA-Z]+/, "Invalid Address.")
    .min(59, "Invalid Address, too short.")
    .max(66, "Invalid Address, too long.")
    .test("check-address", "Invalid address", function (val) {
      const { path, createError } = this;

      if (val === undefined) {
        return false;
      }

      return checkAddress(val)
        .then(() => {
          return true;
        })
        .catch((err) => {
          return createError({ path, message: err });
        });
    }),
});

const VestCreate = () => {
  const { balance: wallet, loadingBalance, error } = useWalletBalance();
  const { walletAddress, walletPublicKey } = useWalletAddress();
  const [calculatedSchedule, setCalculatedSchedule] = useState<any>(undefined);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReviewModal, setReviewModal] = useState(false);

  const [lumpSumPaymentStatus, setLumpSumStatus] = useState<
    false | "pending" | "complete" | "failed" | "ongoing"
  >(false);
  const [contractCreationStatus, setContractCreationStatus] = useState<
    false | "pending" | "complete" | "failed" | "ongoing"
  >(false);
  const [calculateScheduleStatus, setCalculateScheduleStatus] = useState<
    false | "pending" | "complete" | "failed"
  >(false);

  useEffect(() => {
    formik.setFieldValue("address", walletAddress);
    formik.setFieldValue("root", walletPublicKey);
  }, [walletAddress, walletPublicKey]);

  const handleCalculation = async () => {
    setReviewModal(true);

    try {
      setCalculateScheduleStatus("pending");
      const data = await RPC.calculateVestingSchedule(
        formik.values.amount.toString(),
        formik.values.contractLength.toString()
      );
      setCalculatedSchedule(data);
      setCalculateScheduleStatus("complete");
    } catch (error) {
      setCalculateScheduleStatus("failed");
      console.error(error);
    }
  };

  const handleAddressSelection = async (e: any) => {
    formik.setFieldValue("preferred", e.target.value);

    try {
      const userPrefersOwnAddress = e.target.value === "Own";
      if (userPrefersOwnAddress) {
        setLoadingAddress(true);
        const wallet: any = await RPC.getAddress();
        formik.setFieldValue("address", wallet.miniaddress);
        setLoadingAddress(false);
      }

      if (!userPrefersOwnAddress) {
        formik.setFieldValue("address", "");
      }
    } catch (error: any) {
      formik.setFieldError("address", error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      token: wallet[0],
      address: "",
      amount: 0,
      contractLength: 0,
      cliff: 0,
      root: "",
      minBlockWait: 0,
      preferred: false,
      rootPreferred: false,
      lumpsum: false,
      id: "",
    },
    onSubmit: async (formInput) => {
      formik.setStatus(undefined);
      setContractCreationStatus("ongoing");
      setReviewModal(false);
      setShowSuccessModal(true);

      try {
        await RPC.createVestingContract(
          formInput.amount.toString(),
          formInput.cliff,
          formInput.address,
          formInput.token,
          formInput.root,
          formInput.contractLength,
          formInput.minBlockWait,
          formInput.id.replace(`"`, `'`)
        )
          .then((resp) => {
            const contractPaymentPending = resp === 1;
            const contractPaymentCompleted = resp === 0;

            if (contractPaymentPending) setContractCreationStatus("pending");
            if (contractPaymentCompleted) setContractCreationStatus("complete");

            formik.resetForm();
          })
          .catch((err) => {
            setContractCreationStatus("failed");
            formik.setStatus("Contract creation failed, " + err);
            // setShowSuccessModal(false);
          });
      } catch (error: any) {
        const formError =
          error && error.message
            ? error.message
            : error
            ? error
            : "Invalid Form Inputs";
        formik.setStatus(formError);
      }
    },
    enableReinitialize: !loadingBalance,
    validationSchema: formValidation,
  });
  return (
    <>
      <Modal open={showSuccessModal} className={styles["modal"]}>
        <OngoingTransaction>
          <h5>Transaction in progress</h5>
          <div id="content">
            <ul id="list">
              <li>
                <h6>Contract Creation Status</h6>
                {contractCreationStatus === "ongoing" && (
                  <CircularProgress size={8} />
                )}
                {contractCreationStatus === "complete" && <p>Completed!</p>}
                {contractCreationStatus === "failed" && <p>formik.status</p>}
                {contractCreationStatus === "pending" && (
                  <>
                    <p>
                      Your action is now pending, please accept the action by
                      clicking the pending icon{" "}
                      <img
                        id="pending"
                        alt="pending"
                        src="assets/pendingTransaction.svg"
                      />{" "}
                      in the top-right of your apk.
                    </p>
                    <p>
                      If you are on desktop, click the Pending Actions button in
                      the header of your MDS hub.
                    </p>
                  </>
                )}
              </li>
            </ul>
            <Stack alignItems="flex-end">
              <button
                disabled={
                  lumpSumPaymentStatus === "ongoing" ||
                  contractCreationStatus === "ongoing"
                }
                onClick={() => setShowSuccessModal(false)}
              >
                {lumpSumPaymentStatus === "ongoing" ||
                contractCreationStatus === "ongoing" ? (
                  <CircularProgress size={8} />
                ) : (
                  "Ok"
                )}
              </button>
            </Stack>
          </div>
        </OngoingTransaction>
      </Modal>
      <Modal open={showReviewModal} className={styles["modal"]}>
        <OngoingTransaction>
          <h5>Review Contract Creation</h5>
          <div id="content">
            {!calculatedSchedule && (
              <ul id="list">
                <li>
                  <h6>Calculating Schedule</h6>
                  <p>
                    <CircularProgress size={8} />
                  </p>
                </li>
              </ul>
            )}
            {calculateScheduleStatus &&
              calculateScheduleStatus === "complete" &&
              calculatedSchedule && (
                <ul id="list">
                  <li>
                    <h6>Contract Length</h6>
                    <p>{calculatedSchedule.contractLength + " month(s)"}</p>
                  </li>
                  <li>
                    <h6>Collection Address</h6>
                    <p>{formik.values.address}</p>
                  </li>
                  <li>
                    <h6>Cliffing Period</h6>
                    <p>{formik.values.cliff + " month(s)"}</p>
                  </li>
                  <li>
                    <h6>Grace period</h6>
                    <p>{formik.values.minBlockWait + " hour(s)"}</p>
                  </li>
                  <li>
                    <h6>Total Locked Amount</h6>
                    <p>{calculatedSchedule.totalLockedAmount}</p>
                  </li>
                  <li>
                    <h6>Payment per block</h6>
                    <p>{calculatedSchedule.paymentPerBlock}</p>
                  </li>
                  <li>
                    <h6>Payment per month</h6>
                    <p>{calculatedSchedule.paymentPerMonth}</p>
                  </li>
                </ul>
              )}
            {calculateScheduleStatus &&
              calculateScheduleStatus === "failed" &&
              calculatedSchedule && (
                <ul id="list">
                  <li>
                    <h6>Calculating Schedule</h6>
                    <p>Failed! Please try again.</p>
                  </li>
                </ul>
              )}

            <Stack
              alignItems="center"
              flexDirection="row"
              gap={1}
              justifyContent="flex-end"
            >
              <button
                disabled={calculateScheduleStatus === "pending"}
                onClick={() => {
                  setReviewModal(false);
                  setCalculatedSchedule(undefined);
                }}
              >
                Cancel
              </button>

              <button
                disabled={calculateScheduleStatus === "pending"}
                onClick={() => formik.handleSubmit()}
              >
                Create
              </button>
            </Stack>
          </div>
        </OngoingTransaction>
      </Modal>

      <Stack mt={2} textAlign="center" spacing={1}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={5}>
            <Stack spacing={1}>
              {formik.values.token && (
                <>
                  <MiSelect
                    id="token"
                    name="token"
                    placeholder={
                      formik.values.address === "my-address"
                        ? "Getting you a wallet address..."
                        : ""
                    }
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    fullWidth={true}
                    error={
                      formik.touched.token && Boolean(formik.errors.token)
                        ? true
                        : false
                    }
                    tokens={wallet}
                    setFieldValue={formik.setFieldValue}
                    resetForm={formik.resetForm}
                  />
                </>
              )}
              {!formik.values.token && loadingBalance && (
                <p>Fetching all your tokens...</p>
              )}
              {!formik.values.token && !loadingBalance && <p>{error}</p>}
              <InputWrapperRadio>
                <InputLabel>Enter a wallet address</InputLabel>
                {!formik.values.preferred && (
                  <RadioGroup
                    defaultValue={formik.values.preferred}
                    id="radio-group"
                    onChange={handleAddressSelection}
                  >
                    <FormControlLabel
                      label="Use my Minima wallet address"
                      value="Own"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      value="Custom"
                      label="Use a different wallet address"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                )}
                {formik.values.preferred && (
                  <Stack spacing={1} sx={{ p: 2 }}>
                    <InputWrapper>
                      <TextField
                        id="address"
                        name="address"
                        disabled={loadingAddress}
                        placeholder={
                          loadingAddress
                            ? "Getting you an address..."
                            : "Address"
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.dirty && formik.errors.address}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        value={formik.values.address}
                      />
                    </InputWrapper>
                    <Button
                      onClick={() => formik.setFieldValue("preferred", false)}
                      variant="outlined"
                      color="inherit"
                    >
                      Back
                    </Button>
                  </Stack>
                )}

                <p>A withdrawal address for this contract.</p>
              </InputWrapperRadio>

              <FormGroup>
                <FormLabel>Contract amount</FormLabel>
                <TextField
                  type="number"
                  fullWidth
                  id="amount"
                  name="amount"
                  placeholder="amount"
                  helperText={formik.dirty && formik.errors.amount}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Cliffing period (optional)</FormLabel>

                <Select
                  id="cliff"
                  name="cliff"
                  value={formik.values.cliff}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                >
                  <option defaultValue={0} disabled value={0}>
                    Set a cliff period
                  </option>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <option key={i} value={i}>
                      {i} month
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <FormLabel>Grace period (optional)</FormLabel>

                <Select
                  id="minBlockWait"
                  name="minBlockWait"
                  value={formik.values.minBlockWait}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                >
                  <option defaultValue={0} disabled value={0}>
                    Set a collection grace period
                  </option>
                  <option key="none" value="0">
                    None
                  </option>
                  <option key="daily" value="24">
                    Daily
                  </option>
                  <option key="weekly" value="168">
                    Weekly
                  </option>
                  <option key="monthly" value="720">
                    Monthly
                  </option>
                  <option key="6-monthly" value="4320">
                    6 months
                  </option>
                  <option key="12-monthly" value="8640">
                    Yearly
                  </option>
                </Select>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="contractLength">Contract length</FormLabel>

                <TextField
                  placeholder="contract total period in month(s)"
                  type="number"
                  fullWidth
                  id="contractLength"
                  name="contractLength"
                  helperText={formik.dirty && formik.errors.contractLength}
                  error={
                    formik.touched.contractLength &&
                    Boolean(formik.errors.contractLength)
                  }
                  value={formik.values.contractLength}
                  InputProps={{
                    endAdornment: (
                      <InputPercentage>
                        <p>months</p>
                      </InputPercentage>
                    ),
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
              </FormGroup>
            </Stack>
            {formik.status && (
              <MiError>
                <label>{formik.status}</label>
              </MiError>
            )}
            <Button
              type="button"
              onClick={handleCalculation}
              disableElevation
              fullWidth
              color="primary"
              variant="contained"
              disabled={!formik.isValid}
            >
              Review
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default VestCreate;
