import { useContext, useState } from "react";
import Contracts from "../../components/contracts";
import { appContext } from "../../AppContext";
import FadeIn from "../../components/UI/Animations/FadeIn";

const Collector = () => {
  const { contracts } = useContext(appContext);

  const [filterText, setFilteredText] = useState("");

  return (
    <>
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
    </>
  );
};

export default Collector;
