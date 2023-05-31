import styles from "./Dialog.module.css";

interface IProps {
  title: string;
  subtitle: any;
  buttonTitle: string;
  dismiss: boolean;
  primaryButtonAction: () => any;
  cancelAction?: () => void;
}
const Dialog = ({
  title,
  subtitle,
  buttonTitle,
  dismiss,
  cancelAction,
  primaryButtonAction,
}: IProps) => {
  return (
    <div>
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
                <button type="button" onClick={() => primaryButtonAction()}>
                  {buttonTitle}
                </button>
                {dismiss && (
                  <button type="button" onClick={cancelAction}>
                    Go back
                  </button>
                )}
              </div>
            </div>
          </section>
        </main>
        <footer />
      </div>
    </div>
  );
};

export default Dialog;
