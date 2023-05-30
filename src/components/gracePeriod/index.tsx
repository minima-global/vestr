import { useState } from "react";

import styles from "./Grace.module.css";
import AppGrid from "../app-grid";

import { CSSTransition } from "react-transition-group";
import Dialog from "../dialog";

const GraceSelect = () => {
  const [current, setCurrent] = useState<null | string>(null);
  const [active, setActive] = useState(false);
  const [warning, setWarning] = useState(false);

  const gracePeriods = [
    {
      None: 0,
    },
    {
      Daily: 24,
    },
    {
      Weekly: 168,
    },
    {
      Monthly: 720,
    },
    {
      Every_6_Months: 4320,
    },
    {
      Yearly: 8640,
    },
  ];

  const handleSelection = (grace: string) => {
    if (warning) {
      setWarning(false);
    }

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
        in={!!warning}
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
          primaryButtonAction={() => handleSelection("None")}
          cancelAction={() => setWarning(false)}
        />
      </CSSTransition>
      <div onClick={() => setActive(true)} className={styles["select"]}>
        <div>
          <h6>{current ? current : "Select grace period"}</h6>
        </div>

        <img
          className={active ? styles.active : ""}
          alt="arrow-d"
          src="./assets/expand_more.svg"
        />
      </div>

      <CSSTransition
        in={!!active}
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
        in={!!active}
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
                {gracePeriods.map((g, i) => (
                  <li
                    onClick={() =>
                      i !== 0
                        ? handleSelection(
                            Object.keys(g).toString().replaceAll("_", " ")
                          )
                        : handleWarning()
                    }
                  >
                    {Object.keys(g).toString().replaceAll("_", " ")}
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
