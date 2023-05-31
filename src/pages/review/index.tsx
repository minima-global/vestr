import { CSSTransition } from "react-transition-group";
import styles from "./Review.module.css";
import { useLocation, useNavigate } from "react-router-dom";

interface IProps {}
export const Review = ({}: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <CSSTransition
      in={true}
      unmountOnExit
      timeout={200}
      classNames={{
        enter: styles.backdropEnter,
        enterDone: styles.backdropEnterActive,
        exit: styles.backdropExit,
        exitActive: styles.backdropExitActive,
      }}
    >
      <section className={styles["grid"]}>
        <section>
          <button type="button" onClick={() => navigate(-1)}>
            <img alt="left-arrow" src="./assets/arrow_back.svg" /> Back
          </button>
          <section>
            <h6>Review contract details</h6>
            <ul>
              <li>
                <h6>Contract ID</h6>
                <p>{location.state.contract.id}</p>
              </li>
              <li>
                <h6>Contract length</h6>
                <p>{location.state.contract.length}</p>
              </li>
              <li>
                <h6>Collection address</h6>
                <p>{location.state.contract.address}</p>
              </li>
              <li>
                <h6>Cliff period</h6>
                <p>{location.state.contract.cliff + " month(s)"}</p>
              </li>
              <li>
                <h6>Grace period</h6>
                <p>{location.state.contract.grace + " hour(s)"}</p>
              </li>
              <li>
                <h6>Token amount</h6>
                <p>{location.state.contract.amount}</p>
              </li>
              <li>
                <h6>Token ID</h6>
                <p>{location.state.contract.token.tokenid}</p>
              </li>
              <li>
                <h6>Payment per block</h6>
                <p>1234</p>
              </li>
              <li>
                <h6>Payment per month</h6>
                <p>1234</p>
              </li>
            </ul>
          </section>
          <div>
            <button type="submit">Create</button>
            <button type="button">Cancel</button>
          </div>
        </section>
      </section>
    </CSSTransition>
  );
};

export default Review;
