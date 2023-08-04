import { useContext, useState } from "react";
import styles from "./Creator.module.css";
import { Outlet, useLocation, matchPath, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Contracts from "../../components/contracts";
import { appContext } from "../../AppContext";
import FadeIn from "../../components/UI/Animations/FadeIn";
const Creator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contracts } = useContext(appContext);
  const reviewPath = matchPath(
    { path: "/dashboard/creator/create/review/:id" },
    location.pathname
  );
  const createPath = matchPath(
    { path: "/dashboard/creator/create" },
    location.pathname
  );
  const contractDetailPath = matchPath(
    { path: "/dashboard/creator/contract/:id" },
    location.pathname
  );
  const calculatePath = matchPath(
    { path: "/dashboard/creator/calculate" },
    location.pathname
  );

  const [filterText, setFilteredText] = useState("");

  return (
    <>
      {(Boolean(createPath) ||
        Boolean(reviewPath) ||
        Boolean(contractDetailPath) ||
        Boolean(calculatePath)) && (
        <FadeIn delay={0}>
          <Outlet />
        </FadeIn>
      )}

      {!Boolean(createPath) &&
        !Boolean(reviewPath) &&
        !Boolean(contractDetailPath) &&
        !Boolean(calculatePath) && (
          <section className={styles["grid"]}>
            <section>
              <button onClick={() => navigate("calculate")} type="button">
                <img alt="calculate-icon" src="./assets/calculate.svg" />
                Calculate a contract
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate("create", { state: { tokenid: "0x00" } })
                }
              >
                <img alt="add-icon" src="./assets/add.svg" />
                Create a contract
              </button>
            </section>
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
        )}
    </>
  );
};

export default Creator;
