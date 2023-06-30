import { RefObject, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Calculate.module.css";
import { CSSTransition } from "react-transition-group";
import Tooltip from "../../components/tooltip";
import * as RPC from "../../minima/libs/RPC";
import { DateTimePicker } from "@mui/x-date-pickers";

const Calculate = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const customStartInputRef: RefObject<HTMLInputElement> = useRef(null);
  const customEndInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [dateTimePickerConstraintsOnCliff, setDateTimePickerConstraintOnCliff] =
    useState<Date | null>(null);

  const [schedule, setSchedule] = useState<any>();
  const [tooltips, setTooltips] = useState({
    amount: false,
    start: false,
    end: false,
  });

  const calculateSchedule = async () => {
    const schedule = await RPC.calculateVestingSchedule(amount, start!, end!);
    setSchedule(schedule);
  };

  useEffect(() => {
    calculateSchedule();
  }, [amount, start, end]);

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
            <p>Use the calculator below to decide on a vesting schedule.</p>
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
                type="number"
                min={0}
                id="amount"
                name="amount"
                value={amount === 0 ? "" : amount}
                onChange={(e: any) => setAmount(e.target.value)}
              />
            </label>
            <label htmlFor="start" className={styles["form-group"]}>
              <span>
                Contract start
                {!tooltips.start && (
                  <img
                    onClick={(e) => {
                      e.preventDefault();
                      setTooltips({ ...tooltips, start: true });
                    }}
                    alt="question"
                    src="./assets/help_filled.svg"
                  />
                )}
                {!!tooltips.start && (
                  <img
                    onClick={(e) => {
                      e.preventDefault();
                      setTooltips({ ...tooltips, start: false });
                    }}
                    alt="question"
                    src="./assets/cancel_filled.svg"
                  />
                )}
              </span>
              <CSSTransition
                in={tooltips.start}
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
                  content="The date & time the contract starts"
                  position={124}
                />
              </CSSTransition>
              <DateTimePicker
                open={openStartPicker}
                disablePast={true}
                onOpen={() => setOpenStartPicker(true)}
                minDateTime={new Date()}
                value={start}
                PopperProps={{ anchorEl: customStartInputRef.current }}
                onChange={(value) => {
                  setStart(value);
                  setDateTimePickerConstraintOnCliff(value);
                }}
                onClose={() => setOpenStartPicker(false)}
                renderInput={({ ref, inputProps, disabled, onChange }) => {
                  return (
                    <div ref={ref}>
                      <input
                        id="start"
                        name="start"
                        className={styles["datetime-input"]}
                        onClick={() => setOpenStartPicker(true)}
                        // value={}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder="Select contract start"
                        ref={customStartInputRef}
                        {...inputProps}
                      />
                    </div>
                  );
                }}
              />
            </label>
            <label htmlFor="end" className={styles["form-group"]}>
              <span>
                Contract end
                {!tooltips.end && (
                  <img
                    onClick={(e) => {
                      e.preventDefault();
                      setTooltips({ ...tooltips, end: true });
                    }}
                    alt="question"
                    src="./assets/help_filled.svg"
                  />
                )}
                {!!tooltips.end && (
                  <img
                    onClick={(e) => {
                      e.preventDefault();
                      setTooltips({ ...tooltips, end: false });
                    }}
                    alt="question"
                    src="./assets/cancel_filled.svg"
                  />
                )}
              </span>
              <CSSTransition
                in={tooltips.end}
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
                  content="The date & time the contract ends"
                  position={114}
                />
              </CSSTransition>
              <DateTimePicker
                open={openEndPicker}
                disablePast={true}
                onOpen={() => setOpenEndPicker(true)}
                minDateTime={dateTimePickerConstraintsOnCliff}
                value={end}
                PopperProps={{ anchorEl: customEndInputRef.current }}
                onChange={(value) => {
                  setEnd(value);
                }}
                onClose={() => setOpenEndPicker(false)}
                renderInput={({ ref, inputProps, disabled, onChange }) => {
                  return (
                    <div ref={ref}>
                      <input
                        id="end"
                        name="end"
                        className={styles["datetime-input"]}
                        onClick={() => setOpenEndPicker(true)}
                        // value={}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder="Select contract end"
                        ref={customEndInputRef}
                        {...inputProps}
                      />
                    </div>
                  );
                }}
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
                    <p>
                      {!schedule || !Number(schedule.paymentPerBlock)
                        ? "-"
                        : schedule.paymentPerBlock}
                    </p>
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
