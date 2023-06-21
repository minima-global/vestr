import { useState } from "react";
import styles from "./TimeSelection.module.css";

interface IProps {
  options: any[];
  setForm: (o: string) => void;
}
const TimeSelector = ({ options, setForm }: IProps) => {
  const [time, setTime] = useState("days");
  const [openModal, setModal] = useState(false);

  const handleSelect = (selection: any, value: any) => {
    setTime(selection);
    setModal(false);
    setForm(value);
  };

  return (
    <div className={styles["layout"]}>
      <div
        onClick={() => setModal((prevState) => !prevState)}
        className={styles["picker"]}
      >
        <span>
          {`${time.charAt(0).toUpperCase()}${time.substring(1, time.length)}`}
        </span>
        <img
          className={openModal ? styles.active : ""}
          alt="arrow-d"
          src="./assets/expand_more.svg"
        />
      </div>
      {openModal && (
        <div className={styles["dd"]}>
          <ul>
            {options.map((o, i) => (
              <li
                key={i}
                onClick={() => handleSelect(o.option, o.value)}
              >{`${o.option.charAt(0).toUpperCase()}${o.option.substring(
                1,
                o.option.length
              )}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
