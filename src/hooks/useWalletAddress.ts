import { useEffect, useState } from "react";
import * as RPC from "../minima/libs/RPC";

const useWalletAddress = () => {
  const [walletAddress, setAddress] = useState("");
  const [walletPublicKey, setPublicKey] = useState("");

  useEffect(() => {
    RPC.getAddress()
      .then((res: any) => {
        setAddress(res.miniaddress);
        setPublicKey(res.publickey);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return {
    walletAddress,
    walletPublicKey,
  };
};

export default useWalletAddress;
