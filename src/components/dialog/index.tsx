import useGetInnerHeight from "../../hooks/useGetInnerHeight";
import styles from "./Dialog.module.css";

interface IProps {
  title: string;
  subtitle: any;
  buttonTitle: string;
  dismiss: boolean;
  primaryButtonAction: () => any;
  cancelAction?: () => void;
  primaryButtonDisable?: boolean;
}
const Dialog = ({
  title,
  subtitle,
  buttonTitle,
  dismiss,
  cancelAction,
  primaryButtonAction,
  primaryButtonDisable = false,
}: IProps) => {
  const innerHeight = useGetInnerHeight();
  return (
    <div>
      <div className={styles["backdrop"]} />
      <div className={styles["grid"]} style={{ height: `${innerHeight}px` }}>
        <header />
        <main>
          <section>
            <div className={styles["dialog"]}>
              <div>
                <h6>{title}</h6>
                {subtitle}
              </div>
              <div className="flex justify-center flex-col gap-4">
                <button
                  disabled={primaryButtonDisable}
                  className="!bg-black !tracking-widest font-bold"
                  type="button"
                  onClick={() => primaryButtonAction()}
                >
                  {buttonTitle}
                </button>                
                  {dismiss && (
                    <button
                      className="mx-auto p-0 underline underline-offset-8 font-bold tracking-widest focus:outline-none focus:animate-pulse"
                      type="button"
                      onClick={cancelAction}
                    >
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
