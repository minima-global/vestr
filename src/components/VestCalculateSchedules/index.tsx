import React from "react";
import { useFormik } from "formik";
import {
  Stack,
  Button,
  CircularProgress,
  TextField,
  FormLabel,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Toolbar,
} from "@mui/material";
import MiError from "../MiCustom/MiError/MiError";
import styles from "./VestCalculateSchedules.module.css";

import * as RPC from "../../minima/libs/RPC";

const VestCalculateSchedules = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<false | string>(false);
  const [data, setData] = React.useState<any>(undefined);

  const formik = useFormik({
    initialValues: {
      amount: "",
      percentageAtLaunch: "",
      contractLength: "",
    },
    onSubmit: async (formData) => {
      setLoading(true);
      setError(false);
      formik.setStatus(undefined);

      try {
        const totalLockedAmount = formData.amount;
        const launchPercentage = parseInt(formData.percentageAtLaunch) / 100;
        const contractLength = formData.contractLength;
        const calculatedSchedule = await RPC.calculateVestingSchedule(
          totalLockedAmount,
          launchPercentage,
          contractLength
        );
        console.log(calculatedSchedule);
        setData(calculatedSchedule);
      } catch (error: any) {
        formik.setStatus(error.message);
        setError(error.message);
      }
    },
  });

  return (
    <Stack className={styles["calculate"]}>
      <Toolbar />
      {!data && (
        <>
          <form className={styles["form"]} onSubmit={formik.handleSubmit}>
            <Stack spacing={5}>
              <Stack spacing={1}>
                {formik.status ? (
                  <MiError>
                    <label>{formik.status}</label>
                  </MiError>
                ) : null}

                <FormGroup>
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <TextField
                    type="text"
                    fullWidth
                    id="amount"
                    name="amount"
                    helperText={formik.dirty && formik.errors.amount}
                    error={
                      formik.touched.amount && Boolean(formik.errors.amount)
                    }
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="percentageAtLaunch">
                    Launch Percentage
                  </FormLabel>
                  <TextField
                    type="number"
                    fullWidth
                    inputProps={{
                      max: 100,
                    }}
                    id="percentageAtLaunch"
                    name="percentageAtLaunch"
                    helperText={
                      formik.dirty && formik.errors.percentageAtLaunch
                    }
                    error={
                      formik.touched.percentageAtLaunch &&
                      Boolean(formik.errors.percentageAtLaunch)
                    }
                    value={formik.values.percentageAtLaunch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="contractLength">
                    Contract Length (months)
                  </FormLabel>

                  <TextField
                    type="number"
                    inputProps={{
                      max: 100,
                    }}
                    fullWidth
                    id="contractLength"
                    name="contractLength"
                    helperText={formik.dirty && formik.errors.contractLength}
                    error={
                      formik.touched.contractLength &&
                      Boolean(formik.errors.contractLength)
                    }
                    value={formik.values.contractLength}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                </FormGroup>
              </Stack>
              <Button
                type="submit"
                disableElevation
                fullWidth
                color="primary"
                variant="contained"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {!formik.isSubmitting && "Calculate"}
                {formik.isSubmitting && <CircularProgress size={16} />}
              </Button>
            </Stack>
          </form>
        </>
      )}

      {data && (
        <form>
          <Stack spacing={5}>
            <List className={styles["schedule"]}>
              <ListSubheader>Vesting Schedule</ListSubheader>
              <ListItem>
                <ListItemText
                  primary="Contract amount"
                  secondary={data.totalLockedAmount}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="On launch payout percentage"
                  secondary={data.launchPercentage}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Initial payout"
                  secondary={data.initialPayout}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment per block"
                  secondary={data.paymentPerBlock}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment per month (every 51840 blocks)"
                  secondary={data.paymentPerMonth}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contract length"
                  secondary={data.contractLength + " months"}
                />
              </ListItem>
            </List>

            <Button
              onClick={() => setData(undefined)}
              disableElevation
              fullWidth
              color="inherit"
              variant="contained"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Go back
            </Button>
          </Stack>
        </form>
      )}
    </Stack>
  );
};

export default VestCalculateSchedules;
