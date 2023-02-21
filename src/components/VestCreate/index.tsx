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
import { MinimaToken } from "../../@types";
import MiSelect from "../MiCustom/MiSelect/MiSelect";
import Select from "../MiCustom/Select";
import { DateTimePicker } from "@mui/x-date-pickers";

import { events } from "../../minima/libs/events";
import * as RPC from "../../minima/libs/RPC";
import styles from "./VestCreate.module.css";

import { isDate } from "date-fns";
import { TabButton, Tabs } from "../MiCustom/MiTabs";
import useTabs from "../../hooks/useTabs";

import DataTable from "../VestContractsTable";
import { addMonths } from "date-fns";
import MiSuccessModal from "../MiCustom/MiSuccessModal/MiSuccessModal";
import MiError from "../MiCustom/MiError/MiError";
import { Box } from "@mui/system";

const VestCreate = () => {
  // create wallet state
  const [wallet, setWallet] = useState<MinimaToken[]>([]);
  const [dynamicByCliff, setDynamicByCliff] = useState<undefined | Date>(
    undefined
  );

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const closeModal = () => setShowSuccessModal(false);
  const { tabs, toggleTab, tabStyles } = useTabs();

  const handleAddressSelection = (e: any) => {
    if (e.target.value === "other-address") {
      return formik.setFieldValue("address", "");
    }

    RPC.getAddress().then((res: any) => {
      formik.setFieldValue("address", res.address);
    });
  };
  const handleKeySelection = (e: any) => {
    if (e.target.value === "other-key") {
      return formik.setFieldValue("root", "");
    }

    RPC.getAddress().then((res: any) => {
      formik.setFieldValue("root", res.publickey);
    });
  };

  events.onNewBalance(() => {
    RPC.getMinimaBalance()
      .then((balance) => {
        setWallet(balance);
      })
      .catch((err) => {
        const errorMessage = err && err.message ? err.message : err;
        console.log(err);
        formik.setStatus(errorMessage);
      });
  });

  useEffect(() => {
    // get balance and set state
    RPC.getMinimaBalance()
      .then((balance) => {
        setWallet(balance);
      })
      .catch((err) => {
        const errorMessage = err && err.message ? err.message : err;
        console.log(err);
        formik.setStatus(errorMessage);
      });

    RPC.getAddress().then((res: any) => {
      formik.setFieldValue("address", res.address);
      formik.setFieldValue("root", res.publickey);
    });
  }, []);

  // initialise formik to create form
  const formik = useFormik({
    // create initial values of form
    initialValues: {
      token: wallet[0],
      address: "",
      amount: "",
      endContract: undefined,
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
          await RPC.createVestingContract(
            Number(formInput.amount),
            formInput.cliff,
            formInput.address,
            formInput.token,
            formInput.root,
            formInput.endContract,
            formInput.minBlockWait
          );

          setShowSuccessModal(true);
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
  });
  return (
    <>
      <Modal open={showSuccessModal}>
        <Box>
          <MiSuccessModal
            title="Contract Created!"
            subtitle="Navigate to Track to find your pending contracts"
            closeModal={closeModal}
          />
        </Box>
      </Modal>
      <Stack textAlign="center" spacing={1}>
        <h6 className={styles["form-header"]}>Lock up tokens</h6>
        <Tabs>
          <TabButton
            onClick={() => toggleTab(0)}
            className={tabs === 0 ? tabStyles["tab-open"] : undefined}
          >
            Create
          </TabButton>
          <TabButton
            onClick={() => toggleTab(1)}
            className={tabs === 1 ? tabStyles["tab-open"] : undefined}
          >
            Track
          </TabButton>
        </Tabs>

        {tabs === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={5}>
              <Stack spacing={1} alignItems="center">
                {formik.status ? (
                  <MiError>
                    <label>{formik.status}</label>
                  </MiError>
                ) : null}
                {formik.values.token ? (
                  <MiSelect
                    id="token"
                    name="token"
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
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                <TextField
                  type="number"
                  fullWidth
                  id="amount"
                  name="amount"
                  placeholder="amount"
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
                    console.log(e.target.value);
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
                        error={Boolean(formik.errors.endContract)}
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
                color="inherit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                {!formik.isSubmitting && "Lock"}
                {formik.isSubmitting && <CircularProgress size={16} />}
              </Button>
            </Stack>
          </form>
        )}

        {tabs === 1 && <DataTable />}
      </Stack>
    </>
  );
};

export default VestCreate;
