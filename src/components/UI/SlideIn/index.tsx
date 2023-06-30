import { CSSTransition } from "react-transition-group";
import styles from "./SlideIn.module.css";
interface IProps {
  display: boolean;
  timeout: number;
  children: any;
}
const SlideIn = ({ display, timeout, children }: IProps) => {
  return (
    <CSSTransition
      unmountOnExit
      in={display}
      timeout={timeout}
      classNames={{
        enter: styles.backdropEnter,
        enterDone: styles.backdropEnterActive,
        exit: styles.backdropExit,
        exitActive: styles.backdropExitActive,
      }}
    >
      {children}
    </CSSTransition>
  );
};

export default SlideIn;
