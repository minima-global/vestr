import { useState, useContext, useEffect } from "react";

import styles from "./WalletSelect.module.css";
import { MinimaToken } from "../../@types";
import AppGrid from "../app-grid";

import { CSSTransition } from "react-transition-group";
import { appContext } from "../../AppContext";
import { containsText } from "../../utils/utils";

interface IProps {
  setFormToken: (token: MinimaToken) => void;
  currentToken: MinimaToken;
}
const WalletSelect = ({ setFormToken, currentToken }: IProps) => {
  const { walletBalance: balance } = useContext(appContext);
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState(false);

  const handleSelection = (token: MinimaToken) => {
    setFormToken(token);
    setActive(false);
  };

  return (
    <>
      {currentToken && (
        <>
          <div onClick={() => setActive(true)} className={styles["select"]}>
            {currentToken.tokenid === "0x00" && (
              <img alt="token-icon" src="./assets/minimaToken.svg" />
            )}
            {currentToken.tokenid !== "0x00" && (
              <img
                alt="token-icon"
                src={
                  "url" in currentToken.token && currentToken.token.url.length
                    ? currentToken.token.url
                    : `https://robohash.org/${currentToken.tokenid}`
                }
              />
            )}
            <div>
              {currentToken.tokenid === "0x00" && <h6>Minima</h6>}
              {currentToken.tokenid !== "0x00" && (
                <h6>
                  {currentToken?.token && "name" in currentToken?.token
                    ? currentToken?.token.name
                    : "Name not available"}
                </h6>
              )}

              <p>{currentToken.sendable}</p>
            </div>

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
                    <h6>Select token</h6>
                    <img
                      onClick={() => setActive(false)}
                      alt="dismiss-icon"
                      src="./assets/dismiss.svg"
                    />
                  </div>
                  <input
                    onChange={(e) => setSearchText(e.target.value)}
                    type="search"
                    placeholder="Search token"
                  />
                  {balance.filter(
                    (t: MinimaToken) =>
                      containsText(
                        t.tokenid === "0x00"
                          ? t.token
                          : "name" in t.token
                          ? t.token.name
                          : "",
                        searchText
                      ) || containsText(t.tokenid, searchText)
                  ).length > 0 && (
                    <ul>
                      {balance
                        .filter(
                          (t: MinimaToken) =>
                            containsText(
                              t.tokenid === "0x00"
                                ? t.token
                                : "name" in t.token
                                ? t.token.name
                                : "",
                              searchText
                            ) || containsText(t.tokenid, searchText)
                        )
                        .map((t: MinimaToken) => (
                          <li
                            key={t.tokenid}
                            onClick={() => handleSelection(t)}
                          >
                            {t.tokenid === "0x00" && (
                              <img
                                alt="token-icon"
                                src="./assets/minimaToken.svg"
                              />
                            )}
                            {t.tokenid !== "0x00" && (
                              <img
                                alt="token-icon"
                                src={
                                  "url" in t.token && t.token.url.length
                                    ? t.token.url
                                    : `https://robohash.org/${t.tokenid}`
                                }
                              />
                            )}

                            <div>
                              {t.tokenid === "0x00" && <h6>Minima</h6>}
                              {t.tokenid !== "0x00" && (
                                <h6>
                                  {t.token && "name" in t?.token
                                    ? t?.token.name
                                    : "Name not available"}
                                </h6>
                              )}

                              <p>{t.sendable}</p>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}

                  {balance.filter(
                    (t: MinimaToken) =>
                      containsText(
                        t.tokenid === "0x00"
                          ? t.token
                          : "name" in t.token
                          ? t.token.name
                          : "",
                        searchText
                      ) || containsText(t.tokenid, searchText)
                  ).length === 0 && (
                    <div>
                      <p className={styles["no-contracts"]}>No results</p>
                    </div>
                  )}
                </div>
              }
            />
          </CSSTransition>
        </>
      )}
    </>
  );
};

export default WalletSelect;
