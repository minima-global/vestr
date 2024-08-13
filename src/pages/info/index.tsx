import { Stack } from "@mui/material";
import styles from "./Info.module.css";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../components/UI/Animations/FadeIn";
import AnimateFadeIn from "../../components/UI/Animations/AnimateFadeIn";

const Info = () => {
  const navigate = useNavigate();
  return (
    <AnimateFadeIn display={true}>
      <div>
        <h6>
          Vestr enables you to create and collect vesting contracts for any
          Minima token.
        </h6>
        <Stack rowGap={2} className="mt-8">
          <div className={styles["helper__wrapper"]}>
            <h6>Creator</h6>
            <p>I want to create a vesting contract</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/creator/create")}
              className="bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center justify-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
            >
              Create a contract
            </button>
          </div>
          <div className={styles["helper__wrapper"]}>
            <h6>Collector</h6>
            <p>I want to collect tokens from a vesting contract</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/collector")}
              className="bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center justify-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
            >
              Collect tokens
            </button>
          </div>
        </Stack>
      </div>
    </AnimateFadeIn>
  );
};

export default Info;
