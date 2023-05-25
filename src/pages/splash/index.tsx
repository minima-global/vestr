import { useEffect, useState } from "react";
import styles from "./Splash.module.css";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate();
  const [displayBrand, setBrand] = useState(true);
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    setTimeout(() => setBrand(false), 2500);
  }, []);
  const handleClick = () => {
    if (screen < 4) {
      setScreen((s) => (s !== 4 ? s + 1 : 0));
    }
    if (screen === 4) {
      navigate("/dashboard");
    }
  };

  const IntroductionText = [
    <h6>
      Hello nice to <br /> meet you
    </h6>,
    <h6>
      Easily manage all <br /> your digital assets <br /> in one place
    </h6>,
    <h6>
      Send and receive <br /> tokens and NFTs
    </h6>,
    <h6>
      Self custody allows <br /> you take full control <br /> of your assets
    </h6>,
    <h6>Let's get you setup</h6>,
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
              <img alt="icon" src="./assets/brand.svg" />
              <h6>Vestr</h6>
            </div>
          )}
          {!displayBrand && IntroductionText[screen]}
        </div>
        {!!displayBrand && <p></p>}
        {!displayBrand && <p>Tap to continue</p>}
      </div>
    </div>
  );
};

export default SplashPage;
