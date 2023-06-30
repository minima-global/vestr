import { useEffect, useState } from "react";
import * as RPC from "../minima/libs/RPC";

const useWalletAddress = () => {
  const [walletAddress, setAddress] = useState("");
  const [walletPublicKey, setPublicKey] = useState("");

  useEffect(() => {
    RPC.getAddress().then((response: any) => {
      setAddress(response.miniaddress);
      setPublicKey(response.publickey);
    });
  }, []);

  return {
    walletAddress,
    walletPublicKey,
  };
};

export default useWalletAddress;
