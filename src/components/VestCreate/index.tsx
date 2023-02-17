import { useState, useEffect, useRef } from "react";

import { useFormik } from "formik";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
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

const VestCreate = () => {
  // create wallet state
  const [wallet, setWallet] = useState<MinimaToken[]>([]);
  const [dynamicByCliff, setDynamicByCliff] = useState<undefined | Date>(
    undefined
  );

  const { tabs, setTabOpen, toggleTab, tabStyles } = useTabs();

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
  }, []);

  // initialise formik to create form
  const formik = useFormik({
    // create initial values of form
    initialValues: {
      token: wallet[0],
      address: "",
      amount: 0,
      endContract: undefined,
      cliff: 0,
      root: "",
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
            formInput.amount,
            formInput.cliff,
            formInput.address,
            formInput.token,
            formInput.root,
            formInput.endContract
          );
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
    <Stack textAlign="center" spacing={1}>
      <h6 className={styles["form-header"]}>Lock Minima</h6>
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
                <div className={styles["form-error"]}>{formik.status}</div>
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
  );
};

export default VestCreate;
