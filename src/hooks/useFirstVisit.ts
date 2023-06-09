import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import * as utils from "../utils/utils";

const useFirstVisit = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const firstTime = localStorage.getItem(utils.getAppUID());

    if (!firstTime) {
      return localStorage.setItem(utils.getAppUID(), "1");
    }

    if (firstTime) {
      navigate("/dashboard/about");
    }
  }, []);
};

export default useFirstVisit;
