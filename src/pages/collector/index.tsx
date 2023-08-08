import { useContext, useState } from "react";
import styles from "./Collector.module.css";
import Contracts from "../../components/contracts";
import { appContext } from "../../AppContext";
import FadeIn from "../../components/UI/Animations/FadeIn";

const Collector = () => {
  const { contracts } = useContext(appContext);

  const [filterText, setFilteredText] = useState("");

  return (
    <FadeIn delay={0}>
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
    </FadeIn>
  );
};

export default Collector;
