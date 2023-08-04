import { useState } from "react";

import styles from "./Grace.module.css";
import AppGrid from "../app-grid";
import FadeIn from "../UI/Animations/FadeIn";
import { CSSTransition } from "react-transition-group";
export const gracePeriods: any = {
  Daily: 24,
  Weekly: 168,
  Monthly: 720,
  Every_6_Months: 4320,
  Yearly: 8640,
};

export function getObjectKey(obj: any, value: any) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

interface IProps {
  setFormValue: (value: number) => void;
  currentValue: number;
}
const GraceSelect = ({ setFormValue, currentValue }: IProps) => {
  const [active, setActive] = useState(false);

  const handleSelection = (grace: string) => {
    setFormValue(gracePeriods[grace.replaceAll(" ", "_")]);
    setActive(false);
  };

  return (
    <>
      <div onClick={() => setActive(true)} className={styles["select"]}>
        <div>
          {currentValue
            ? Object.keys(gracePeriods)
                .find((k) => gracePeriods[k] === currentValue)
                ?.replaceAll("_", " ")
            : "Select grace period"}
        </div>

        <img
          className={active ? styles.active : ""}
          alt="arrow-d"
          src="./assets/expand_more.svg"
        />
      </div>

      {active && (
        <FadeIn delay={0}>
          <div className={styles["backdrop"]} />
        </FadeIn>
      )}

      <CSSTransition
        in={active}
        unmountOnExit
        timeout={100}
        classNames={{
          enter: styles.ddMenuEnter,
          enterDone: styles.ddMenuEnterActive,
          exit: styles.ddMenuExit,
          exitActive: styles.ddMenuExitActive,
        }}
      >
        <AppGrid
          children={
            <div className={styles["dd"]}>
              <div>
                <h6>Select grace period</h6>
                <img
                  onClick={() => setActive(false)}
                  alt="dismiss-icon"
                  src="./assets/dismiss.svg"
                />
              </div>

              <ul>
                {Object.keys(gracePeriods).map((g, i) => (
                  <li
                    className={`${
                      currentValue === gracePeriods[g] ? styles.selected : ""
                    }`}
                    key={g}
                    onClick={() => {
                      if (currentValue === gracePeriods[g]) {
                        return;
                      }

                      handleSelection(g.replaceAll("_", " "));
                    }}
                  >
                    {g.replaceAll("_", " ")}
                  </li>
                ))}
              </ul>
            </div>
          }
        />
      </CSSTransition>
    </>
  );
};

export default GraceSelect;
