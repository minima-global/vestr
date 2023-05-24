import { useEffect, useState } from "react";
import { events } from "../minima/libs/events";

const useMinima = () => {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    events.onInit(() => setStatus(true));
  }, []);

  return status;
};

export default useMinima;
