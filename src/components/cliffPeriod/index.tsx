import { useState, useEffect, useRef } from "react";

import styles from "./Cliff.module.css";
import AppGrid from "../app-grid";

import { CSSTransition } from "react-transition-group";

import { useLocation, useNavigate } from "react-router-dom";

const CliffSelect = () => {
  const [current, setCurrent] = useState<null | string>(null);
  const [active, setActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.cliff) {
      setCurrent(location.state.cliff);
    }
  }, [location]);

  const handleSelection = (cliff: number) => {
    setCurrent(cliff === 1 ? cliff + " month" : cliff + " months");
    setActive(false);
    navigate("/dashboard/creator/create", {
      state: { ...location.state, cliff },
    });
  };

  return (
    <>
      <div onClick={() => setActive(true)} className={styles["select"]}>
        <div>{current ? current : "Select cliff period"}</div>

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
                <h6>Select cliff period</h6>
                <img
                  onClick={() => setActive(false)}
                  alt="dismiss-icon"
                  src="./assets/dismiss.svg"
                />
              </div>

              <ul>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                  <li key={c} onClick={() => handleSelection(c)}>
                    {c === 1 ? "1 month" : c + " months"}
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

export default CliffSelect;
