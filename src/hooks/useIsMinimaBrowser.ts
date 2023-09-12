const useIsMinimaBrowser = () => {
  const openTitleBar = () => {
    if (window.navigator.userAgent.includes("Minima Browser")) {
      // @ts-ignore
      return Android.showTitleBar();
    }
  };

  return openTitleBar;
};

export default useIsMinimaBrowser;
