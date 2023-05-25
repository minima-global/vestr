import styles from "./Dialog.module.css";

interface IProps {
  title: string;
  subtitle: any;
  buttonTitle: string;
  dismiss: boolean;
}
const Dialog = ({ title, subtitle, buttonTitle, dismiss }: IProps) => {
  return (
    <>
      <div className={styles["backdrop"]} />
      <div className={styles["grid"]}>
        <header />
        <main>
          <section>
            <div className={styles["dialog"]}>
              <div>
                <h6>{title}</h6>
                {subtitle}
              </div>
              <div className={styles["button__wrapper"]}>
                <button type="button">{buttonTitle}</button>
                {dismiss && <button type="button">Cancel</button>}
              </div>
            </div>
          </section>
        </main>
        <footer />
      </div>
    </>
  );
};

export default Dialog;
