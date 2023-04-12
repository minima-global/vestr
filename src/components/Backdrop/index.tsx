import styles from "./Backdrop.module.css";

interface IProps {
  close: () => void;
}
const Backdrop = ({ close }: IProps) => {
  return <div onClick={close} className={styles["backdrop"]} />;
};

export default Backdrop;
