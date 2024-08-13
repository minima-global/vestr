import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contracts from "../../components/contracts";
import { appContext } from "../../AppContext";
import AnimateFadeIn from "../../components/UI/Animations/AnimateFadeIn";
const Creator = () => {
  const navigate = useNavigate();
  const { contracts } = useContext(appContext);
  const [filterText, setFilteredText] = useState("");

  return (
    <AnimateFadeIn display={true}>
      <section>
        <div className="space-y-4 mb-4">
          <button
            className="bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
            onClick={() => navigate("calculate")}
            type="button"
          >
            <img alt="calculate-icon" src="./assets/calculate.svg" />
            Calculate a contract
          </button>
          <button
            className="bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
            type="button"
            onClick={() => navigate("create", { state: { tokenid: "0x00" } })}
          >
            <img alt="add-icon" src="./assets/add.svg" />
            Create a contract
          </button>
        </div>
        <div>
          <div className="mb-4 w-full">
            <h6 className="mb-2 font-bold tracking-wide">My contracts</h6>
            <input
              type="search"
              placeholder="Search contract id or alias"
              onChange={(e: any) => setFilteredText(e.target.value)}
              className="w-full p-4 py-2 rounded bg-white focus:outline-none focus:outline focus:outline-offset-1 focus:outline-yellow-400 placeholder:tracking-wide"
            />
          </div>

          <div>
            {!contracts.size && !filterText.length && (
              <div>
                <p>You currently have no vested contracts</p>
              </div>
            )}

            {!!contracts.size && (
              <Contracts
                filterText={filterText}
                coins={Array.from(contracts.values())}
              />
            )}
          </div>
        </div>
      </section>
    </AnimateFadeIn>
  );
};

export default Creator;
