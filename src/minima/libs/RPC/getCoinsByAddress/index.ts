import { Coin } from "../../../../@types";

export const getCoinsByAddress = (
  address: string
): Promise<{ address: string; relevantCoins: Coin[] }> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`coins address:${address} relevant:true`, (res) => {
      console.log(res);
      if (!res.status) reject("RPC Failed");

      resolve({
        address: res.params.address,
        relevantCoins: res.response,
      });
    });
  });
};

export default getCoinsByAddress;
