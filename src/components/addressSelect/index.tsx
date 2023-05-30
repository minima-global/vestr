import useWalletAddress from "../../hooks/useWalletAddress";
import styles from "./Address.module.css";

const AddressSelect = () => {
  const { walletAddress } = useWalletAddress();

  return (
    <>
      <div className={styles["radio-wrapper"]}>
        <label htmlFor="my-address">
          <input
            type="radio"
            id="my-address"
            name="radio"
            value={walletAddress}
          />
          Use my Minima wallet address
        </label>

        <label htmlFor="custom-address">
          <input
            disabled
            type="radio"
            id="custom-address"
            name="radio"
            value=""
          />
          Use a different wallet address
        </label>
      </div>
    </>
  );
};

export default AddressSelect;
