import styles from "./Address.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const AddressSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: any) => {
    navigate("/dashboard/creator/create", {
      state: {
        ...location.state,
        addressPreference: e.target.value,
      },
    });
  };

  return (
    <>
      <div onChange={handleChange} className={styles["radio-wrapper"]}>
        <label htmlFor="my-address">
          <input
            defaultChecked={
              location.state &&
              location.state.addressPreference &&
              location.state.addressPreference === "0"
            }
            // disabled={
            //   location.state &&
            //   location.state.addressPreference &&
            //   location.state.addressPreference === "1"
            // }
            type="radio"
            id="my-address"
            name="radio"
            value={0}
          />
          Use my Minima wallet address
        </label>

        <label htmlFor="custom-address">
          <input
            defaultChecked={
              location.state &&
              location.state.addressPreference &&
              location.state.addressPreference === "1"
            }
            // disabled={
            //   location.state &&
            //   location.state.addressPreference &&
            //   location.state.addressPreference === "0"
            // }
            type="radio"
            id="custom-address"
            name="radio"
            value={1}
          />
          Use a different wallet address
        </label>
      </div>
    </>
  );
};

export default AddressSelect;
