import { useState } from "react";
import styles from "./Review.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as RPC from "../../minima/libs/RPC";

import { format } from "date-fns";
import FadeIn from "../../components/UI/Animations/FadeIn";
import BackIcon from "../../components/UI/Icons/BackIcon";

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
          <div>
              <button
                className="p-0 m-0 font-bold tracking-wide flex items-center gap-1 hover:text-opacity-80"
                type="button"
                onClick={() => closeReview()}
              >
                <span className="text-black">
                  <BackIcon fill="currentColor" />
                </span>
                Back
              </button>
            </div>
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
                <li>
                  <h6>Burn</h6>
                  {schedule && Number(contract.burn) > 0 ? (
                    <p>{contract.burn}</p>
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
                className="p-2 tracking-wide disabled:opacity-30 hover:bg-yellow-300 focus:outline-none bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center justify-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
                disabled={isSubmitting}
                type="button"
                onClick={() => submitForm()}
              >
                Create
              </button>
              <button
                className="mx-auto p-0 underline underline-offset-8 font-bold tracking-widest focus:outline-none focus:animate-pulse disabled:opacity-30"
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
