import { MinimaToken } from "../../../../@types";

export const getMinimaBalance = (): Promise<MinimaToken[]> => {
  return new Promise((resolve, reject) => {
    MDS.cmd("balance", (res) => {
      if (!res.status) reject("RPC Unavailable");

      resolve(res.response);
    });
  });
};

export default getMinimaBalance;
