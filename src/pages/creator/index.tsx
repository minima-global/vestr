import { useContext, useState } from "react";
import styles from "./Creator.module.css";
import { useNavigate } from "react-router-dom";
import Contracts from "../../components/contracts";
import { appContext } from "../../AppContext";
import FadeIn from "../../components/UI/Animations/FadeIn";
const Creator = () => {
  const navigate = useNavigate();
  const { contracts } = useContext(appContext);
  const [filterText, setFilteredText] = useState("");

  return (
    <FadeIn delay={0}>
      <section className={styles["grid"]}>
        <section>
          <button
            className="text-black"
            onClick={() => navigate("calculate")}
            type="button"
          >
            <img alt="calculate-icon" src="./assets/calculate.svg" />
            Calculate a contract
          </button>
          <button
            className="text-black"
            type="button"
            onClick={() => navigate("create", { state: { tokenid: "0x00" } })}
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
    </FadeIn>
  );
};

export default Creator;
