import { useState } from "react";
import styles from "./Creator.module.css";
import { Stack } from "@mui/material";
const Creator = () => {
  const [contracts, setContracts] = useState([]);

  return (
    <section className={styles["grid"]}>
      <section>
        <button type="button">
          <img alt="calculate-icon" src="./assets/calculate.svg" />
          Calculate a contract
        </button>
        <button type="button">
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
          {contracts.length === 0 && (
            <div>
              <p className={styles["no-contracts"]}>
                You currently have no vesting contracts
              </p>
            </div>
          )}

          {contracts.length > 0 && (
            <ul>
              {contracts.map((c) => (
                <li></li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </section>
  );
};

export default Creator;
