import { useState, useEffect } from "react";

import styles from "./WalletSelect.module.css";
import { MinimaToken } from "../../@types";
import { useLocation, useNavigate } from "react-router-dom";
import useWalletBalance from "../../hooks/useWalletBalance";
import AppGrid from "../app-grid";

import { CSSTransition } from "react-transition-group";

interface IProps {}
const WalletSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance } = useWalletBalance();
  const [searchText, setSearchText] = useState("");
  const [current, setCurrent] = useState<MinimaToken | undefined>(undefined);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setCurrent(
      location.state && location.state.tokenid
        ? balance.find((t) => t.tokenid === location.state.tokenid)
        : balance[0]
    );
  }, [balance, location]);

  const handleSelection = (token: MinimaToken) => {
    navigate("/dashboard/creator/create", {
      state: { ...location.state, tokenid: token.tokenid },
    });
    setCurrent(token);
    setActive(false);
  };

  return (
    <>
      {!!current && (
        <div onClick={() => setActive(true)} className={styles["select"]}>
          {current.tokenid === "0x00" && (
            <img alt="token-icon" src="./assets/minimaToken.svg" />
          )}
          {current.tokenid !== "0x00" && (
            <img
              alt="token-icon"
              src={
                "url" in current.token && current.token.url.length
                  ? current.token.url
                  : `https://robohash.org/${current.tokenid}`
              }
            />
          )}
          <div>
            {current.tokenid === "0x00" && <h6>Minima</h6>}
            {current.tokenid !== "0x00" && (
              <h6>
                {current?.token && "name" in current?.token
                  ? current?.token.name
                  : "Name not available"}
              </h6>
            )}

            <p>{current.sendable}</p>
          </div>

          <img
            className={active ? styles.active : ""}
            alt="arrow-d"
            src="./assets/expand_more.svg"
          />
        </div>
      )}

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
              <input type="search" placeholder="Search token" />
              <ul>
                {balance.map((t) => (
                  <li onClick={() => handleSelection(t)}>
                    {t.tokenid === "0x00" && (
                      <img alt="token-icon" src="./assets/minimaToken.svg" />
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
            </div>
          }
        />
      </CSSTransition>
    </>
  );
};

export default WalletSelect;
