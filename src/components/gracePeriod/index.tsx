import { useState, useEffect } from "react";

import styles from "./Grace.module.css";
import AppGrid from "../app-grid";

import { CSSTransition } from "react-transition-group";
import Dialog from "../dialog";
import { useLocation, useNavigate } from "react-router-dom";

export const gracePeriods: any = {
  None: 0,
  Daily: 24,
  Weekly: 168,
  Monthly: 720,
  Every_6_Months: 4320,
  Yearly: 8640,
};

export function getObjectKey(obj: any, value: any) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

const GraceSelect = () => {
  const [current, setCurrent] = useState<null | string>(null);
  const [active, setActive] = useState(false);
  const [warning, setWarning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.grace) {
      setCurrent(location.state.grace);
    }
  }, [location]);

  const handleSelection = (grace: string) => {
    console.log("grace", grace.replaceAll(" ", "_"));
    navigate("/dashboard/creator/create", {
      state: {
        ...location.state,
        grace: grace,
      },
    });

    setCurrent(grace);
    setActive(false);
  };

  const handleWarning = () => {
    setActive(false); // close main Modal
    setWarning(true); // open warning
  };

  return (
    <>
      <CSSTransition
        in={warning}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
        <Dialog
          title="Grace period"
          subtitle={
            <p>
              Please note, if you do not set a grace <br /> period, the
              recipient will be able to collect <br /> tokens after every block
            </p>
          }
          buttonTitle="Confirm"
          dismiss={true}
          primaryButtonAction={() => {
            setWarning(false);
            handleSelection("None");
          }}
          cancelAction={() => setWarning(false)}
        />
      </CSSTransition>
      <div onClick={() => setActive(true)} className={styles["select"]}>
        <div>{current ? current : "Select grace period"}</div>

        <img
          className={active ? styles.active : ""}
          alt="arrow-d"
          src="./assets/expand_more.svg"
        />
      </div>

      <CSSTransition
        in={active}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
        <div className={styles["backdrop"]} />
      </CSSTransition>
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
                    onClick={() => {
                      if (i === 0) {
                        handleWarning();
                      }
                      if (i !== 0) {
                        handleSelection(g.replaceAll("_", " "));
                      }
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
