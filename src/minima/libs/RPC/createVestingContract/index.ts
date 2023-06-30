import { MinimaToken } from "../../../../@types";
import Decimal from "decimal.js";
import * as RPC from "../../RPC";

/**
 *
 * @param amount
 * @param address
 * @param token
 * @param grace minimum time user waits before collecting again
 * @param uid unique id for the contract
 * @param contractaddress
 * @param password
 * @param start contract start date and time (kind of like the cliff..)
 * @param end contract end date and time
 * @returns
 */
export const createVestingContract = async (
  amount: string,
  address: string,
  token: MinimaToken,

  grace: number,

  uid: string,

  contractaddress: string,
  password: string,

  start: Date,
  end: Date
): Promise<0 | 1> => {
  const endContractBlockHeight = await RPC.calculateBlockHeightFromDate(end);
  const startContractBlockHeight = await RPC.calculateBlockHeightFromDate(
    start
  );

  const minimumTimeUserMustWaitToCollectAgain = new Decimal(grace)
    .times(3600)
    .dividedBy(50);

  return new Promise((resolve, reject) => {
    MDS.cmd(
      `send debug:false ${
        password.length ? "password:" + password : ""
      } amount:${amount} address:${contractaddress} tokenid:${
        token.tokenid
      } state:{"0":"${address}","1":"${amount}","2":"${startContractBlockHeight}", "3":"${endContractBlockHeight}","4":"${minimumTimeUserMustWaitToCollectAgain}","5":"${new Date().getTime()}","6":"${start.getTime()}","7":"${grace}","8":"${end.getTime()}", "199":"${uid}"}`,
      (res) => {
        if (!res.status && !res.pending)
          reject(
            res.error ? res.error : res.message ? res.message : "RPC Failed"
          );

        if (!res.status && res.pending) return resolve(1);

        return resolve(0);
      }
    );
  });
};

export default createVestingContract;
