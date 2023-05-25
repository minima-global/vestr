import styles from "./Info.module.css";

const Info = () => {
  return (
    <section className={styles["grid"]}>
      <h6>About Vestr</h6>
      <p>
        Vestr enables you to calculate, create and track vesting schedules for
        any token that you issue on the Minima blockchain.
      </p>
    </section>
  );
};

export default Info;
