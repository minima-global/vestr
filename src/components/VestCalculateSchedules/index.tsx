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
} from "@mui/material";
// import MiError from "../MiCustom/MiError/MiError";
import styles from "./VestCalculateSchedules.module.css";

import * as RPC from "../../minima/libs/RPC";
import * as Yup from "yup";
import { InputPercentage } from "../InputWrapper/InputWrapper";

const formValidation = Yup.object().shape({
  amount: Yup.string().required("Field required"),
  contractLength: Yup.string().required("Field required"),
  // percentageAtLaunch: Yup.string().required("Field required"),
});

interface IProps {
  totalLockedAmount?: string;
  totalLaunchPercentage?: string;
  totalPeriod?: string;
}
const VestCalculateSchedules = ({
  totalLaunchPercentage,
  totalLockedAmount,
  totalPeriod,
}: IProps) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<false | string>(false);
  const [data, setData] = React.useState<any>(undefined);
  const hasExampleValues =
    totalLaunchPercentage && totalLockedAmount && totalPeriod;

  const formik = useFormik({
    initialValues: {
      amount: "",
      // percentageAtLaunch: "",
      contractLength: "",
    },
    onSubmit: async (formData) => {
      setLoading(true);
      setError(false);
      formik.setStatus(undefined);

      try {
        if (hasExampleValues) {
          const calculatedSchedule = await RPC.calculateVestingSchedule(
            totalLockedAmount,
            // parseInt(totalLaunchPercentage) / 100,
            totalPeriod
          );
          setData(calculatedSchedule);
        }
        if (!hasExampleValues) {
          const totalLockedAmount = formData.amount;
          // const launchPercentage = parseInt(formData.percentageAtLaunch) / 100;
          const contractLength = formData.contractLength;
          const calculatedSchedule = await RPC.calculateVestingSchedule(
            totalLockedAmount,
            // launchPercentage,
            contractLength
          );
          // console.log(calculatedSchedule);
          setData(calculatedSchedule);
        }
      } catch (error: any) {
        formik.setStatus(error.message);
        setError(error.message);
      }
    },
    validationSchema: !hasExampleValues ? formValidation : undefined,
  });

  return (
    <Stack className={styles["calculate"]}>
      {!data && (
        <>
          <form className={styles["form"]} onSubmit={formik.handleSubmit}>
            <Stack spacing={5}>
              <Stack spacing={1}>
                {/* {formik.status ? (
                  <MiError>
                    <label>{formik.status}</label>
                  </MiError>
                ) : null} */}

                <FormGroup>
                  <FormLabel htmlFor="amount">Contract Amount</FormLabel>
                  <TextField
                    placeholder="total locked amount"
                    type="text"
                    fullWidth
                    id="amount"
                    name="amount"
                    helperText={formik.dirty && formik.errors.amount}
                    error={
                      formik.touched.amount && Boolean(formik.errors.amount)
                    }
                    inputProps={{
                      readOnly: !!totalLockedAmount && true,
                    }}
                    value={
                      totalLockedAmount
                        ? totalLockedAmount
                        : formik.values.amount
                    }
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
                    placeholder="contract total period in months"
                    type="number"
                    inputProps={{
                      max: 100,
                      readOnly: !!totalPeriod && true,
                    }}
                    fullWidth
                    id="contractLength"
                    name="contractLength"
                    helperText={formik.dirty && formik.errors.contractLength}
                    error={
                      formik.touched.contractLength &&
                      Boolean(formik.errors.contractLength)
                    }
                    value={
                      totalPeriod ? totalPeriod : formik.values.contractLength
                    }
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
            <List sx={{ p: 0, m: 0 }} className={styles["schedule"]}>
              <h5 className={styles["list-title"]}>Vesting Schedule</h5>
              <ListItem>
                <ListItemText
                  primary="Contract amount"
                  secondary={data.totalLockedAmount}
                />
              </ListItem>
              {/* <ListItem>
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
              </ListItem> */}
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
              Recalculate
            </Button>
          </Stack>
        </form>
      )}
    </Stack>
  );
};

export default VestCalculateSchedules;
