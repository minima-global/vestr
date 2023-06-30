import { FocusEvent } from "react";
import useWalletAddress from "../../hooks/useWalletAddress";
import styles from "./Address.module.css";

interface IProps {
  currentSelection: { preference: string; current: string };
  setFormValue: (address: string, preference: string) => void;
}
const AddressSelect = ({ currentSelection, setFormValue }: IProps) => {
  const walletAddress = useWalletAddress();

  const handleChange = (e: any) => {
    const personalAddress = e.target.value === "0";

    if (personalAddress) {
      return setFormValue(walletAddress.walletAddress, e.target.value);
    }

    return setFormValue("", e.target.value);
  };

  return (
    <>
      <div onChange={handleChange} className={styles["radio-wrapper"]}>
        <label htmlFor="my-address">
          <input
            defaultChecked={currentSelection.preference === "0"}
            type="radio"
            id="my-address"
            name="address.preference"
            value={0}
          />
          Use my Minima wallet address
        </label>

        <label htmlFor="custom-address">
          <input
            defaultChecked={currentSelection.preference === "1"}
            type="radio"
            id="custom-address"
            name="address.preference"
            value={1}
          />
          Use a different wallet address
        </label>
      </div>
    </>
  );
};

export default AddressSelect;
