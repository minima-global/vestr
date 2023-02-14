import { useState, useEffect } from "react";

import { useFormik } from "formik";
import { Button, Stack, TextField } from "@mui/material";
import { MinimaToken } from "../../@types";
import MiSelect from "../MiCustom/MiSelect/MiSelect";

import styles from "./VestCreate.module.css";

import * as RPC from "../../minima/libs/RPC";

import { DateTimePicker } from "@mui/x-date-pickers";
import Select from "../MiCustom/Select";
import { events } from "../../minima/libs/events";

const VestCreate = () => {
  // create wallet state
  const [wallet, setWallet] = useState<false | MinimaToken[]>(false);

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
      token: wallet ? wallet[0] : false,
      address: "",
      amount: 0,
      endContract: undefined,
      cliff: undefined,
      root: "",
    },
    onSubmit: (data: any) => {
      console.log("Creating vestr contract..");
    },
    enableReinitialize: !!wallet,
  });
  return (
    <Stack textAlign="center">
      <h6 className={styles["form-header"]}>Lock Minima</h6>
      <form>
        <Stack spacing={5}>
          <Stack spacing={1} alignItems="center">
            {formik.status ? <div>{formik.status}</div> : null}
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
            />
            <TextField
              fullWidth
              id="root"
              name="root"
              placeholder="root key"
              value={formik.values.root}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <Select
              id="cliff"
              name="cliff"
              value={formik.values.cliff}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
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
              disablePast={true}
              value={formik.values.endContract}
              onChange={(value) => {
                formik.setFieldValue("endContract", value, true);
              }}
              renderInput={(params: any) => {
                return (
                  <TextField
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
            disableElevation
            fullWidth
            color="inherit"
            variant="contained"
          >
            Lock
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default VestCreate;
