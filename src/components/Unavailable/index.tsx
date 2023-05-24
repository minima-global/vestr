import styles from "./Unavailable.module.css";
const Unavailable = () => {
  return (
    <div className={styles["grid"]}>
      <h6>Minima is unavailable</h6>
      <p>Please check the status of your node and try again.</p>
    </div>
  );
};

export default Unavailable;
