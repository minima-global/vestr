import { useState } from "react";
import styles from "./Creator.module.css";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
const Creator = () => {
  const navigate = useNavigate();
  const isMatch = useMatch("/dashboard/creator/create");
  const [contracts, setContracts] = useState([]);
  const [filterText, setFilteredText] = useState("");

  return (
    <>
      {!!isMatch && <Outlet />}
      {!isMatch && (
        <section className={styles["grid"]}>
          <section>
            <button type="button">
              <img alt="calculate-icon" src="./assets/calculate.svg" />
              Calculate a contract
            </button>
            <button type="button" onClick={() => navigate("create")}>
              <img alt="add-icon" src="./assets/add.svg" />
              Create a contract
            </button>
          </section>
          <section>
            <section>
              <h6>My contracts</h6>
              <input type="search" placeholder="Search contract" />
            </section>
            <section>
              {!contracts.length && !filterText.length && (
                <div>
                  <p className={styles["no-contracts"]}>
                    You currently have no vesting contracts
                  </p>
                </div>
              )}

              {!!contracts.length && !filterText.length && (
                <ul>
                  {contracts.map((c) => (
                    <li></li>
                  ))}
                </ul>
              )}

              {!!contracts.length && filterText.length && (
                <ul>
                  {contracts.map((c) => (
                    <li></li>
                  ))}
                </ul>
              )}
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default Creator;
