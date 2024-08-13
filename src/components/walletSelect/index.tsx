import React, { useState, useContext } from "react";
import styles from "./WalletSelect.module.css";
import { MinimaToken } from "../../@types";
import { appContext } from "../../AppContext";
import { containsText } from "../../utils/utils";
import AnimatedDialog from "../AnimatedDialog";
import CloseIcon from "../UI/Icons/CloseIcon";
import CaretIcon from "../UI/Icons/CaretIcon";

interface IProps {
  setFormToken: (token: MinimaToken) => void;
  currentToken: MinimaToken;
}

const WalletSelect: React.FC<IProps> = ({ setFormToken, currentToken }) => {
  const { walletBalance: balance } = useContext(appContext);
  const [searchText, setSearchText] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);

  const handleSelection = (token: MinimaToken) => {
    setFormToken(token);
    setActive(false);
  };

  const filteredBalance = balance.filter((t: MinimaToken) =>
    containsText(
      t.tokenid === "0x00" ? t.token : "name" in t.token ? t.token.name : "",
      searchText
    ) || containsText(t.tokenid, searchText)
  );

  const renderTokenItem = (token: MinimaToken) => {
    const isMinimaToken = token.tokenid === "0x00";
    const tokenName = isMinimaToken ? "Minima" : "name" in token.token ? token.token.name : "N/A";
    const tokenImageSrc = isMinimaToken
      ? "./assets/token.svg"
      : token.token && "url" in token.token && token.token.url.length
      ? decodeURIComponent(token.token.url)
      : `https://robohash.org/${token.tokenid}`;
    const tokenValue = token.unconfirmed !== "0" ? `${token.sendable}/${token.unconfirmed}` : token.sendable;

    return (
      <li
        key={token.tokenid}
        onClick={() => handleSelection(token)}
        className="flex bg-neutral-100 rounded-lg cursor-pointer"
      >
        <img src={tokenImageSrc} alt={`${tokenName}-token`} className="rounded-l-lg w-[56px] h-[56px] bg-yellow-300" />
        <div className="my-auto ml-2 grid">
          <p className="font-bold p-0 text-base">{tokenName}</p>
          <input
            readOnly
            className="focus:outline-none bg-transparent overflow-hidden truncate text-base w-full"
            value={tokenValue}
          />
        </div>
      </li>
    );
  };

  return (
    <>
      {currentToken && (
        <div
          onClick={() => setActive((prevState) => !prevState)}
          className="w-full flex border justify-between overflow-hidden truncate rounded-lg cursor-pointer"
        >
          {renderTokenItem(currentToken)}
          <span className="my-auto mr-2">
            <CaretIcon extraClass={`transition-transform ${active && "rotate-180 "}`} />
          </span>
        </div>
      )}
      <AnimatedDialog display={active} dismiss={() => setActive(false)}>
        <div className="modal-content">
          <div className="flex items-center justify-between p-4 border-b border-black">
            <h3 className="text-black font-bold text-lg">Select Token</h3>
            <button
              onClick={() => setActive(false)}
              aria-label="Close"
              className="text-black bg-transparent"
            >
              <CloseIcon fill="currentColor" />
            </button>
          </div>

          <div className="my-3 mx-4 md:mx-0">
            <input
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search token"
              type="search"
              className="bg-white rounded p-3 px-4 w-full focus:outline-none focus:border focus:border-black"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-0">
            <ul className="overflow-y-auto space-y-2">
              {filteredBalance.length > 0 ? (
                filteredBalance.map((token: MinimaToken) => renderTokenItem(token))
              ) : (
                <div>
                  <p className="text-[#1B1B1B] text-center text-sm">No results</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </AnimatedDialog>
    </>
  );
};

export default WalletSelect;
