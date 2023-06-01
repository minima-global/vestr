import styles from "./Contract.module.css";
import { Coin } from "../../@types";
import { containsText } from "../../utils/utils";

interface IProps {
  coins: Coin[];
  filterText: string;
}
const Contracts = ({ coins, filterText }: IProps) => {
  console.log("rendering contracts", coins);
  return (
    <>
      {coins.filter((c) =>
        containsText(MDS.util.getStateVariable(c, 199), filterText)
      ).length > 0 && (
        <ul className={styles["contracts"]}>
          {coins
            .filter((c) =>
              containsText(MDS.util.getStateVariable(c, 199), filterText)
            )
            .map((c) => (
              <li className={styles["list-item"]}>
                {c.tokenid === "0x00" && (
                  <img alt="token-image" src="./assets/minimaLogoSquare.png" />
                )}
                {c.tokenid !== "0x00" && (
                  <img
                    alt="token-image"
                    src={
                      c.token.url && c.token.url.length
                        ? c.token.url
                        : `https://robohash.org/${c.tokenid}`
                    }
                  />
                )}
                <div>
                  <h6>
                    {MDS.util.getStateVariable(c, 199)
                      ? MDS.util.getStateVariable(c, 199)
                      : "N/A"}
                  </h6>

                  <p>{c.tokenid === "0x00" ? c.amount : c.tokenamount}</p>
                </div>
                <button type="button">View</button>
              </li>
            ))}
        </ul>
      )}
      {coins.filter((c) =>
        containsText(MDS.util.getStateVariable(c, 199), filterText)
      ).length === 0 && (
        <div>
          <p className={styles["no-contracts"]}>No results</p>
        </div>
      )}
    </>
  );
};

export default Contracts;
