import { useState, useEffect } from "react";

import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";

import Select from "../MiCustom/Select";
import { DateTimePicker } from "@mui/x-date-pickers";
import * as RPC from "../../minima/libs/RPC";

import { isDate } from "date-fns";
import { addMonths } from "date-fns";
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
import Decimal from "decimal.js";
import OngoingTransaction from "../OngoingTransaction";

import styles from "./VestCreate.module.css";

const formValidation = yup.object().shape({
  token: yup.object().required("Field is required"),
  endContract: yup
    .mixed()
    .required("Field is required")
    .test("check-datetime", "Invalid datetime", function (val) {
      const { path, createError, parent } = this;

      if (val === undefined) {
        return false;
      }

      if (!isDate(val)) {
        return createError({ path, message: `Please select a valid date` });
      }

      return true;
    }),
  amount: yup
    .string()
    .required("Field is required")
    .matches(/^[^a-zA-Z\\;'"]+$/, "Invalid characters."),
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
  const wallet = useWalletBalance();
  const { walletAddress, walletPublicKey } = useWalletAddress();
  const [dynamicByCliff, setDynamicByCliff] = useState<undefined | Date>(
    undefined
  );
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingPublicKey, setLoadingPublicKey] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);

  const [lumpSumPaymentStatus, setLumpSumStatus] = useState<
    false | "pending" | "complete" | "failed" | "ongoing"
  >(false);
  const [contractCreationStatus, setContractCreationStatus] = useState<
    false | "pending" | "complete" | "failed" | "ongoing"
  >(false);

  useEffect(() => {
    formik.setFieldValue("address", walletAddress);
    formik.setFieldValue("root", walletPublicKey);
  }, [walletAddress, walletPublicKey]);

  const closeModal = () => {
    setShowSuccessModal(false);
    if (transactionPending) {
      setTransactionPending(false);
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

  const handlePublicKeySelection = async (e: any) => {
    formik.setFieldValue("rootPreferred", e.target.value);

    try {
      const userPrefersOwnKey = e.target.value === "Own";
      if (userPrefersOwnKey) {
        setLoadingPublicKey(true);
        const wallet: any = await RPC.getAddress();
        formik.setFieldValue("root", wallet.publickey);
        setLoadingPublicKey(false);
      }

      if (!userPrefersOwnKey) {
        formik.setFieldValue("root", "");
      }
    } catch (error: any) {
      formik.setFieldError("root", error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      token: wallet[0],
      address: "",
      amount: "",
      endContract: null,
      cliff: 0,
      root: "",
      minBlockWait: 0,
      preferred: false,
      rootPreferred: false,
      lumpsum: false,
    },
    onSubmit: async (formInput) => {
      formik.setStatus(undefined);
      setContractCreationStatus("ongoing");
      setShowSuccessModal(true);

      if (
        typeof formInput.endContract === null ||
        !isDate(formInput.endContract)
      )
        throw new Error("Select an appropriate time & date");

      try {
        if (
          formInput &&
          formInput.endContract &&
          isDate(formInput.endContract)
        ) {
          const hasLumpSumPayment =
            typeof formInput.lumpsum === "number"
              ? new Decimal(formInput.lumpsum)
              : false;
          const percentage = hasLumpSumPayment
            ? hasLumpSumPayment.dividedBy(100)
            : false;
          const lumpSumAmount = percentage
            ? new Decimal(formInput.amount).times(percentage)
            : false;

          if (lumpSumAmount) {
            setLumpSumStatus("ongoing");
            return new Promise((resolve, reject) => {
              MDS.cmd(
                `send amount:${lumpSumAmount} address:${formInput.address} tokenid:${formInput.token.tokenid}`,
                (res: any) => {
                  if (!res.status && !res.pending)
                    reject(res.error ? res.error : "Rpc failed");
                  if (!res.status && res.pending) resolve(1);
                  console.log(res);

                  resolve(0);
                }
              );
            })
              .then(async (res) => {
                const lumpPaymentPending = res === 1;
                const lumpPaymentCompleted = res === 0;
                if (lumpPaymentCompleted) {
                  setLumpSumStatus("complete");
                }
                if (lumpPaymentPending) {
                  setLumpSumStatus("pending");
                }

                if (
                  !isDate(formInput.endContract) ||
                  formInput.endContract === null
                )
                  throw new Error("Select an appropriate date & time");

                await RPC.createVestingContract(
                  !lumpSumAmount
                    ? formInput.amount
                    : new Decimal(formInput.amount)
                        .minus(lumpSumAmount)
                        .toString(),
                  formInput.cliff,
                  formInput.address,
                  formInput.token,
                  formInput.root,
                  formInput.endContract,
                  formInput.minBlockWait
                )
                  .then((resp) => {
                    const contractPaymentPending = resp === 1;
                    const contractPaymentCompleted = resp === 0;

                    if (contractPaymentPending)
                      setContractCreationStatus("pending");
                    if (contractPaymentCompleted)
                      setContractCreationStatus("complete");

                    formik.resetForm();
                  })
                  .catch((err) => {
                    setContractCreationStatus("failed");
                    formik.setStatus("Contract creation failed, " + err);
                    setShowSuccessModal(false);
                  });
              })

              .catch((err) => {
                setLumpSumStatus("failed");
                formik.setStatus("Lump sum payment failed, " + err);
                setShowSuccessModal(false);
              });
          }
        }
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
    enableReinitialize: !!wallet,
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
                <h6>Lump Sum Payment</h6>
                <p>
                  {lumpSumPaymentStatus === "ongoing" ? (
                    <CircularProgress size={8} />
                  ) : lumpSumPaymentStatus === "complete" ? (
                    "Completed!"
                  ) : lumpSumPaymentStatus === "failed" ? (
                    "Failed"
                  ) : lumpSumPaymentStatus === "pending" ? (
                    "Pending Action"
                  ) : (
                    "Not set"
                  )}
                </p>
              </li>
              <li>
                <h6>Contract Creation Status</h6>{" "}
                <p>
                  {contractCreationStatus === "ongoing" ? (
                    <CircularProgress size={8} />
                  ) : contractCreationStatus === "complete" ? (
                    "Completed!"
                  ) : contractCreationStatus === "failed" ? (
                    "Failed"
                  ) : contractCreationStatus === "pending" ? (
                    "Pending Action"
                  ) : (
                    "No transaction ongoing"
                  )}
                </p>
              </li>
              <li></li>
            </ul>
            <Stack alignItems="flex-end">
              <button onClick={() => setShowSuccessModal(false)}>Ok</button>
            </Stack>
          </div>
        </OngoingTransaction>
      </Modal>

      <Stack mt={2} textAlign="center" spacing={1}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={5}>
            <Stack spacing={1}>
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

              <TextField
                type="text"
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
              <TextField
                type="number"
                fullWidth
                id="lumpsum"
                name="lumpsum"
                placeholder="lump sum percentage"
                helperText={formik.dirty && formik.errors.lumpsum}
                error={formik.touched.amount && Boolean(formik.errors.lumpsum)}
                value={formik.values.lumpsum}
                onChange={(e: any) => {
                  formik.handleChange(e);

                  if (
                    typeof formik.values.lumpsum === "number" &&
                    formik.values.lumpsum > 100
                  ) {
                    formik.setFieldValue("lumpsum", 100);
                  }
                  if (
                    typeof formik.values.lumpsum === "number" &&
                    formik.values.lumpsum < 0
                  ) {
                    formik.setFieldValue("lumpsum", 0);
                  }
                }}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputPercentage>
                      <p>%</p>
                    </InputPercentage>
                  ),
                  inputProps: {
                    max: 100,
                    min: 0,
                  },
                }}
              />
              <InputHelper>
                (optional) Percentage of the total locked{" "}
                {formik.values.amount && formik.values.amount.length
                  ? "(" + formik.values.amount + ")"
                  : ""}{" "}
                amount you want to send the user as soon on contract start.
              </InputHelper>
              <InputWrapperRadio>
                <InputLabel>Enter a root key</InputLabel>
                {!formik.values.rootPreferred && (
                  <RadioGroup
                    defaultValue={formik.values.rootPreferred}
                    id="radio-group"
                    onChange={handlePublicKeySelection}
                  >
                    <FormControlLabel
                      label="Use my node's public key"
                      value="Own"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      value="Custom"
                      label="Use a different node's public key"
                      control={<Radio />}
                    ></FormControlLabel>
                    <FormControlLabel
                      value="None"
                      label="Use none"
                      control={<Radio />}
                    ></FormControlLabel>
                  </RadioGroup>
                )}
                {formik.values.rootPreferred && (
                  <Stack spacing={1} sx={{ p: 2 }}>
                    <InputWrapper>
                      <TextField
                        id="root"
                        name="root"
                        disabled={
                          loadingPublicKey ||
                          (typeof formik.values.rootPreferred === "string" &&
                            formik.values.rootPreferred === "None")
                        }
                        placeholder={
                          loadingPublicKey
                            ? "Getting you a public key..."
                            : typeof formik.values.rootPreferred === "string" &&
                              formik.values.rootPreferred === "None"
                            ? "Disabled"
                            : "Public key"
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={formik.dirty && formik.errors.root}
                        error={
                          formik.touched.root && Boolean(formik.errors.root)
                        }
                        value={formik.values.root}
                      />
                    </InputWrapper>
                    <Button
                      onClick={() =>
                        formik.setFieldValue("rootPreferred", false)
                      }
                      variant="outlined"
                      color="inherit"
                    >
                      Back
                    </Button>
                  </Stack>
                )}

                <p>
                  As an optional, a root key that enables withdrawal at any
                  given time.
                </p>
              </InputWrapperRadio>

              <Select
                id="cliff"
                name="cliff"
                value={formik.values.cliff}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  // according to the cliff period, we have to set the date-time
                  // picker to comply with this rule..
                  // so if they select 2 months, then they can only select an end contract
                  // after that date..
                  setDynamicByCliff(
                    addMonths(new Date(), Number(e.target.value))
                  );
                  // console.log(e.target.value);
                }}
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
              <InputHelper>
                (optional) A minimum amount of wait time required before the
                contract is allowed to be interacted with.
              </InputHelper>
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
              <InputHelper>
                (optional) How often a user can collect.
              </InputHelper>
              <DateTimePicker
                minDateTime={dynamicByCliff ? dynamicByCliff : undefined}
                disablePast={true}
                value={formik.values.endContract}
                onChange={(value) => {
                  formik.setFieldValue("endContract", value, true);
                }}
                renderInput={(params: any) => {
                  return (
                    <TextField
                      placeholder="Enter a date & time for contract's expiry"
                      disabled={formik.isSubmitting}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        placeholder:
                          "Enter a date & time for contract's expiry",
                      }}
                      error={
                        formik.touched.endContract &&
                        Boolean(formik.errors.endContract)
                      }
                      helperText={formik.dirty && formik.errors.endContract}
                      id="datetime"
                      name="datetime"
                      onBlur={formik.handleBlur}
                      {...params}
                    />
                  );
                }}
              />
              <InputHelper>
                A date & time for when this contract ends. After a contract ends
                all funds can be collected.
              </InputHelper>
            </Stack>
            <Button
              type="submit"
              disableElevation
              fullWidth
              color="primary"
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {!formik.isSubmitting && "Lock"}
              {formik.isSubmitting && <CircularProgress size={16} />}
            </Button>
            {formik.status && (
              <MiError>
                <label>{formik.status}</label>
              </MiError>
            )}
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default VestCreate;
