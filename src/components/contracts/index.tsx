import { useNavigate } from "react-router-dom";
import { Coin } from "../../@types";
import { containsText } from "../../utils/utils";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { useContext } from "react";
import { appContext } from "../../AppContext";
import Decimal from "decimal.js";

const gracePeriods: any = {
  Daily: 24,
  Weekly: 168,
  Monthly: 720,
  Every_3_Months: 2190,
  Every_6_Months: 4320,
  Yearly: 8640,
};

export function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

interface IProps {
  coins: Coin[];
  filterText: string;
}

const Contracts = ({ coins, filterText }: IProps) => {
  const navigate = useNavigate();
  const { _contractNicknames } = useContext(appContext);

  // Helper function to check if the filterText is included in the nickname or state variable
  const filterCoin = (coin: Coin) => {
    const stateVariable = MDS.util.getStateVariable(coin, 199);
    const nickname = _contractNicknames?.[stateVariable] || stateVariable;

    return (
      containsText(nickname, filterText) ||
      containsText(stateVariable, filterText)
    );
  };

  // Filter coins based on the filterText
  const filteredCoins = coins.filter(filterCoin);

  return (
    <>
      {filteredCoins.length > 0 ? (
        <ul className="space-y-4">
          {filteredCoins.map((c) => (
            <li
              onClick={() =>
                navigate("contract/" + MDS.util.getStateVariable(c, 199))
              }
              key={c.coinid}
              className="grid grid-rows-[auto_1fr] rounded-l divide-y divide-neutral-100 hover:shadow-sm"
            >
              <div className="grid grid-cols-[auto_1fr_auto] gap-2 bg-neutral-200">
                <div className="h-12 w-12 shrink-0">
                  {c.tokenid === "0x00" ? (
                    <img
                      alt="token"
                      src="./assets/token.svg"
                      className="w-12 h-12 shrink-0"
                    />
                  ) : (
                    <img
                      className="w-12 h-12 shrink-0 bg-yellow-300"
                      alt="token"
                      src={
                        c.token.url && c.token.url.length
                          ? c.token.url
                          : `https://robohash.org/${c.tokenid}`
                      }
                    />
                  )}
                </div>
                <div className="truncate">
                  <input
                    readOnly
                    value={
                      (_contractNicknames &&
                        _contractNicknames[
                          MDS.util.getStateVariable(c, 199)
                        ]) ||
                      MDS.util.getStateVariable(c, 199)
                    }
                    className="w-full bg-transparent focus:outline-none truncate text-sm"
                  />
                  <p className="tracking-wide font-bold">
                    {c.tokenid === "0x00" ? c.amount : c.tokenamount}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 grid grid-cols-2">
                <div className="space-y-2">                  
                    <p className="text-sm text-black font-bold text-left">
                      Total Vested: {MDS.util.getStateVariable(c, 1)}
                    </p>
                    <p className="text-sm text-black font-bold text-left">
                      Collected:{" "}
                      {new Decimal(MDS.util.getStateVariable(c, 1))
                        .minus(c.tokenid === "0x00" ? c.amount as string : c.tokenamount as string)
                        .toString()}
                    </p>
                </div>

                <div>
                  <div>
                    <p className="text-sm text-neutral-700 text-right">
                      Can collect{" "}
                      {getKeyByValue(
                        gracePeriods,
                        parseInt(MDS.util.getStateVariable(c, 7))
                      )?.replace(/[_]/g, " ")}
                    </p>
                  </div>
                  <div className="items-center">
                    <p className="text-sm text-neutral-500 text-right">
                      {isPast(parseInt(MDS.util.getStateVariable(c, 6)))
                        ? "started "
                        : "starts "}
                      {formatDistanceToNow(
                        parseInt(MDS.util.getStateVariable(c, 6)),
                        { addSuffix: true }
                      )}
                    </p>
                    <p className="text-sm text-neutral-500 text-right">
                      {isPast(parseInt(MDS.util.getStateVariable(c, 8)))
                        ? "ended "
                        : "ends "}
                      {formatDistanceToNow(
                        parseInt(MDS.util.getStateVariable(c, 8)),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p className="text-sm text-neutral-600 text-center">No results</p>
        </div>
      )}
    </>
  );
};

export default Contracts;
