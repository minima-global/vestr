import { useEffect, useState } from "react";
import styles from "./Splash.module.css";
import { useNavigate } from "react-router-dom";
import Vestr from "../../assets/vestr.json";
import Lottie from "lottie-react";
import { CSSTransition } from "react-transition-group";

const SplashPage = () => {
  const navigate = useNavigate();
  const [displayBrand, setBrand] = useState(true);
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    setTimeout(() => setBrand(false), 2500);
  }, []);
  const handleClick = () => {
    if (screen === 0) {
      navigate("/dashboard/about");
    }
  };

  const IntroductionText = [
    <h6>
      Create and <br /> collect vesting <br /> contracts for any <br /> Minima
      token
    </h6>,
  ];

  return (
    <div
      onClick={!!displayBrand ? () => setBrand(false) : handleClick}
      className={`${styles.layout} ${!displayBrand ? styles.dark_bg : ""}`}
    >
      <div>
        <div />
        <div>
          {!!displayBrand && (
            <div className={styles["brand"]}>
              <Lottie
                style={{ width: 110, height: 110 }}
                animationData={Vestr}
              />
              <h6>Vestr</h6>
            </div>
          )}
          <CSSTransition
            unmountOnExit
            in={!displayBrand}
            timeout={500}
            classNames={{
              enter: styles.backdropEnter,
              enterDone: styles.backdropEnterActive,
              exit: styles.backdropExit,
              exitActive: styles.backdropExitActive,
            }}
          >
            {IntroductionText[screen]}
          </CSSTransition>
        </div>
        {!!displayBrand && <p></p>}
        <CSSTransition
          unmountOnExit
          in={!displayBrand}
          timeout={500}
          classNames={{
            enter: styles.backdropEnter,
            enterDone: styles.backdropEnterActive,
            exit: styles.backdropExit,
            exitActive: styles.backdropExitActive,
          }}
        >
          <p>Tap to continue</p>
        </CSSTransition>
      </div>
    </div>
  );
};

export default SplashPage;
