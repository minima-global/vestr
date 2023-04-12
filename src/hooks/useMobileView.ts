import { useEffect, useState, useRef } from "react";

const useMobileView = () => {
  const [isMobileView, setView] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 500) {
        setView(true);
      }
      if (window.innerWidth > 500) {
        setView(false);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  });

  return isMobileView;
};

export default useMobileView;
