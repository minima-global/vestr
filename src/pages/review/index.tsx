import { useState } from "react";
import styles from "./Review.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as RPC from "../../minima/libs/RPC";

import { format } from "date-fns";
import FadeIn from "../../components/UI/Animations/FadeIn";

export const gracePeriods: any = {
  None: 0,
  Daily: 24,
  Weekly: 168,
  Monthly: 720,
  Every_6_Months: 4320,
  Yearly: 8640,
};

export const Review = ({
  submitForm,
  formStatus,
  isSubmitting,
  clearForm,
  contract,
  closeReview,
}: any) => {
  const location = useLocation();
  const [schedule, setSchedule] = useState<any>();

  const scheduleCalculate = async () => {
    const s = await RPC.calculateVestingSchedule(
      contract.amount,
      contract.start,
      contract.end,
      contract.grace
    );

    setSchedule(s);
  };

  useEffect(() => {
    scheduleCalculate();
  }, [location.state]);

  return (
    <>
      <FadeIn delay={0}>
        <section className={styles["grid"]}>
          <section>
            <button
              className={styles["back-btn"]}
              type="button"
              onClick={() => closeReview()}
              disabled={isSubmitting}
            >
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_33_7292"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="16"
                  height="17"
                >
                  <rect y="0.5" width="16" height="16" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_33_7292)">
                  <path
                    d="M6.39969 14.6695L0.230469 8.50027L6.39969 2.33105L7.29582 3.22719L2.02275 8.50027L7.29582 13.7734L6.39969 14.6695Z"
                    fill="#08090B"
                  />
                </g>
              </svg>
              Back
            </button>
            <section>
              <h6>Review contract details</h6>
              <ul>
                <li>
                  <h6>Contract ID</h6>
                  <p>{contract.uid}</p>
                </li>
                <li>
                  <h6>Contract starts</h6>
                  <p>{format(contract.start, "dd MMMM yyyy, hh:mm:ss a")}</p>
                </li>
                <li>
                  <h6>Contract ends</h6>
                  <p>{format(contract.end, "dd MMMM yyyy, hh:mm:ss a")}</p>
                </li>
                <li>
                  <h6>Collection address</h6>
                  <p>{contract.address.hex}</p>
                </li>

                <li>
                  <h6>Grace period</h6>
                  <p>
                    {Object.keys(gracePeriods)
                      .find((k) => gracePeriods[k] === contract.grace)
                      ?.replace(/[_]/g, " ")}
                  </p>
                </li>
                <li>
                  <h6>Token amount</h6>
                  <p>{contract.amount}</p>
                </li>
                <li>
                  <h6>Token ID</h6>
                  <p>{contract.token.selected.tokenid}</p>
                </li>
                <li>
                  <h6>Payment per grace</h6>
                  {schedule && Number(schedule.paymentPerGrace) > 0 ? (
                    <p>{schedule.paymentPerGrace}</p>
                  ) : (
                    <p>-</p>
                  )}
                </li>
              </ul>
            </section>
            {!!formStatus && typeof formStatus === "string" && (
              <div className={styles["formError"]}>{formStatus}</div>
            )}
            <div className={styles["button-wrapper"]}>
              <button
                disabled={isSubmitting}
                type="button"
                onClick={() => submitForm()}
              >
                Create
              </button>
              <button
                className={isSubmitting ? "hidden" : ""}
                type="button"
                onClick={() => {
                  clearForm(); // status
                  closeReview();
                }}
              >
                Cancel
              </button>
            </div>
          </section>
        </section>
      </FadeIn>
    </>
  );
};

export default Review;
