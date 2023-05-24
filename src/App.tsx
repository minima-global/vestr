import { useEffect, useState } from "react";
import { events } from "./minima/libs/events";
import Root from "./components/Root";
import useMinima from "./hooks/useMinima";
import Loading from "./components/Loading";
import Unavailable from "./components/Unavailable";

const App = () => {
  const status = useMinima();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    events.onFail(() => {
      console.error("MDS Unavailable!");
      setError(true);
    });

    return () => {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };
  }, [status]);

  const isReady = !error && status && !loading;
  const isLoading = loading;
  const isNotAvailable = error || (!status && !loading);

  return (
    <>
      {isReady && <Root />}

      {isNotAvailable && <Unavailable />}

      {isLoading && <Loading />}
    </>
  );
};

export default App;
