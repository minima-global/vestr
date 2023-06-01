import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Calculate.module.css";
import { CSSTransition } from "react-transition-group";
import Tooltip from "../../components/tooltip";

const Calculate = () => {
  const navigate = useNavigate();
  const [tooltips, setTooltips] = useState({ amount: false, length: false });
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
            <p>
              Before creating a vesting contract, use the calculator below to
              decide on a schedule.
            </p>
          </section>
          <section>
            <label htmlFor="amount" className={styles["form-group"]}>
              <span>
                Token amount
                {!tooltips.amount && (
                  <img
                    onClick={() => setTooltips({ ...tooltips, amount: true })}
                    alt="question"
                    src="./assets/help_filled.svg"
                  />
                )}
                {!!tooltips.amount && (
                  <img
                    onClick={() => setTooltips({ ...tooltips, amount: false })}
                    alt="question"
                    src="./assets/cancel_filled.svg"
                  />
                )}
              </span>
              <CSSTransition
                in={tooltips.amount}
                unmountOnExit
                timeout={200}
                classNames={{
                  enter: styles.backdropEnter,
                  enterDone: styles.backdropEnterActive,
                  exit: styles.backdropExit,
                  exitActive: styles.backdropExitActive,
                }}
              >
                <Tooltip
                  content="The amount of time before a contract starts."
                  position={120}
                />
              </CSSTransition>
              <input
                placeholder="Token amount"
                type="text"
                id="amount"
                name="amount"
                // value={formik.values.name}
                // onChange={formik.handleChange}
              />
            </label>
            <label htmlFor="length" className={styles["form-group"]}>
              <span>
                Token amount
                {!tooltips.length && (
                  <img
                    onClick={() => setTooltips({ ...tooltips, length: true })}
                    alt="question"
                    src="./assets/help_filled.svg"
                  />
                )}
                {!!tooltips.length && (
                  <img
                    onClick={() => setTooltips({ ...tooltips, length: false })}
                    alt="question"
                    src="./assets/cancel_filled.svg"
                  />
                )}
              </span>
              <CSSTransition
                in={tooltips.length}
                unmountOnExit
                timeout={200}
                classNames={{
                  enter: styles.backdropEnter,
                  enterDone: styles.backdropEnterActive,
                  exit: styles.backdropExit,
                  exitActive: styles.backdropExitActive,
                }}
              >
                <Tooltip
                  content="The number of months the contract lasts."
                  position={120}
                />
              </CSSTransition>
              <input
                placeholder="Contract length"
                type="text"
                id="length"
                name="length"
                // value={formik.values.name}
                // onChange={formik.handleChange}
              />
            </label>
          </section>
          <section>
            <div className={styles["result"]}>
              <div>Result</div>
              <div>
                <ul>
                  <li>
                    <h6>Payment per block</h6>
                    <p>-</p>
                  </li>
                  <li>
                    <h6>Payment per month</h6>
                    <p>-</p>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </section>
      </section>
    </CSSTransition>
  );
};
export default Calculate;
