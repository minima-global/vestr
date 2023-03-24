import { useState, useEffect } from "react";

import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import MiSelect from "../MiCustom/MiSelect/MiSelect";
import Select from "../MiCustom/Select";
import { DateTimePicker } from "@mui/x-date-pickers";
import * as RPC from "../../minima/libs/RPC";
import styles from "./VestCreate.module.css";

import { isDate } from "date-fns";
import { addMonths } from "date-fns";
import MiSuccessModal from "../MiCustom/MiSuccessModal/MiSuccessModal";
import MiError from "../MiCustom/MiError/MiError";
import { Box } from "@mui/system";
import * as yup from "yup";
import { checkAddress } from "../../minima/libs/RPC";
import useWalletBalance from "../../hooks/useWalletBalance";
import useWalletAddress from "../../hooks/useWalletAddress";

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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);

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

  const handleAddressSelection = (e: any) => {
    if (e.target.value === "other-address") {
      return formik.setFieldValue("address", "");
    }

    formik.setFieldValue("address", walletAddress);
  };

  const handleKeySelection = (e: any) => {
    if (e.target.value === "other-key") {
      return formik.setFieldValue("root", "");
    }

    RPC.getAddress().then((res: any) => {
      formik.setFieldValue("root", res.publickey);
    });
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
    },
    onSubmit: async (formInput) => {
      formik.setStatus(undefined);

      try {
        if (!isDate(formInput.endContract)) throw new Error("Not a date..");

        if (
          formInput &&
          formInput.endContract &&
          isDate(formInput.endContract)
        ) {
          const result = await RPC.createVestingContract(
            Number(formInput.amount),
            formInput.cliff,
            formInput.address,
            formInput.token,
            formInput.root,
            formInput.endContract,
            formInput.minBlockWait
          );

          const transactionIsPending = typeof result === "string";
          if (transactionIsPending) {
            setTransactionPending(true);
          }

          setShowSuccessModal(true);
          formik.resetForm();
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
      <Modal open={showSuccessModal}>
        <Box>
          <MiSuccessModal
            title={
              !transactionPending
                ? "Contract Created!"
                : "Contract Creation Pending!"
            }
            subtitle={
              !transactionPending
                ? "Navigate to Track to find your pending contracts"
                : "Now go to your pending transactions to accept this action"
            }
            closeModal={closeModal}
          />
        </Box>
      </Modal>
      <Stack mt={2} textAlign="center" spacing={1}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={5}>
            <Stack spacing={1}>
              {formik.status ? (
                <MiError>
                  <label>{formik.status}</label>
                </MiError>
              ) : null}
              {formik.values.token ? (
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
              ) : null}
              <FormControl className={styles["address-selection"]}>
                <FormLabel>Address</FormLabel>
                <RadioGroup
                  onChange={handleAddressSelection}
                  row
                  defaultValue="my-address"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="my-address"
                    control={<Radio />}
                    label="My Address"
                  />
                  <FormControlLabel
                    value="other-address"
                    control={<Radio />}
                    label="Other Address"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                fullWidth
                id="address"
                name="address"
                placeholder="address"
                helperText={formik.dirty && formik.errors.address}
                error={formik.touched.address && Boolean(formik.errors.address)}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
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
              <FormControl className={styles["address-selection"]}>
                <FormLabel>Select a root key</FormLabel>
                <RadioGroup
                  onChange={handleKeySelection}
                  row
                  defaultValue="my-key"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="my-key"
                    control={<Radio />}
                    label="My Key"
                  />
                  <FormControlLabel
                    value="other-key"
                    control={<Radio />}
                    label="Other Key"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                fullWidth
                id="root"
                name="root"
                placeholder="root key"
                value={formik.values.root}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
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
                      disabled={formik.isSubmitting}
                      fullWidth
                      InputProps={{
                        readOnly: true,
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
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default VestCreate;
