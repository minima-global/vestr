import { useState } from "react";
import styles from "./Collector.module.css";
import { CSSTransition } from "react-transition-group";
import useVestingContracts from "../../hooks/useVestingContract";
import Contracts from "../../components/contracts";
import { Outlet, matchPath, useLocation } from "react-router-dom";

const Collector = () => {
  const contracts = useVestingContracts();
  const location = useLocation();
  const contractDetailPath = matchPath(
    { path: "/dashboard/collector/contract/:id" },
    location.pathname
  );

  const [filterText, setFilteredText] = useState("");

  return (
    <>
      <CSSTransition
        in={Boolean(contractDetailPath)}
        unmountOnExit
        timeout={200}
        classNames={{
          enter: styles.backdropEnter,
          enterDone: styles.backdropEnterActive,
          exit: styles.backdropExit,
          exitActive: styles.backdropExitActive,
        }}
      >
        <Outlet />
      </CSSTransition>
      <CSSTransition
        in={!Boolean(contractDetailPath)}
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
            <section>
              <h6>My contracts</h6>
              <input
                type="search"
                placeholder="Search contract"
                onChange={(e: any) => setFilteredText(e.target.value)}
              />
            </section>
            <section>
              {!contracts.size && !filterText.length && (
                <div>
                  <p className={styles["no-contracts"]}>
                    You currently have no vesting contracts
                  </p>
                </div>
              )}

              {!!contracts.size && (
                <Contracts
                  filterText={filterText}
                  coins={Array.from(contracts.values())}
                />
              )}
            </section>
          </section>
        </section>
      </CSSTransition>
    </>
  );
};

export default Collector;
