import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./Review.module.css";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import * as RPC from "../../minima/libs/RPC";

interface IProps {}
export const Review = ({}: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<any>();
  const { submitForm, formStatus, isSubmitting, clearForm }: any =
    useOutletContext();

  const scheduleCalculate = async () => {
    const s = await RPC.calculateVestingSchedule(
      location.state.contract.amount,
      location.state.contract.length
    );

    setSchedule(s);
  };

  useEffect(() => {
    if (location.state && !location.state.contract) {
      navigate("/dashboard/creator/create");
    }

    scheduleCalculate();
  }, [location.state]);

  return (
    <CSSTransition
      in={true}
      unmountOnExit
      timeout={200}
      classNames={{
        enter: styles.backdropEnter,
        enterDone: styles.backdropEnterActive,
        exit: styles.backdropExit,
        exitActive: styles.backdropExitActive,
      }}
    >
      <section className={styles["grid"]}>
        <section>
          <button
            className={styles["back-btn"]}
            type="button"
            onClick={() => navigate(-1)}
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
                <p>{location.state.contract.id}</p>
              </li>
              <li>
                <h6>Contract length</h6>
                <p>{location.state.contract.length + " month(s)"}</p>
              </li>
              <li>
                <h6>Collection address</h6>
                <p>{location.state.contract.address}</p>
              </li>
              <li>
                <h6>Cliff period</h6>
                <p>{location.state.contract.cliff + " month(s)"}</p>
              </li>
              <li>
                <h6>Grace period</h6>
                <p>{location.state.contract.grace + " hour(s)"}</p>
              </li>
              <li>
                <h6>Token amount</h6>
                <p>{location.state.contract.amount}</p>
              </li>
              <li>
                <h6>Token ID</h6>
                <p>{location.state.contract.token.tokenid}</p>
              </li>
              <li>
                <h6>Payment per block</h6>
                <p>
                  {schedule && schedule.paymentPerBlock
                    ? schedule.paymentPerBlock
                    : "N/A"}
                </p>
              </li>
              <li>
                <h6>Payment per month</h6>
                <p>
                  {schedule && schedule.paymentPerMonth
                    ? schedule.paymentPerMonth
                    : "N/A"}
                </p>
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
              disabled={isSubmitting}
              type="button"
              onClick={() => {
                clearForm(); // status
                navigate(-1);
              }}
            >
              Cancel
            </button>
          </div>
        </section>
      </section>
    </CSSTransition>
  );
};

export default Review;
