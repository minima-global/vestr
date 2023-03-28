import { runScript } from "./../runScript/index";
import { addMonths } from "date-fns";
import { MinimaToken } from "../../../../@types";
import { vestingContract } from "../../contracts";
import Decimal from "decimal.js";
import * as RPC from "../../RPC";

/**
 *
 * @param amount amount to lock up
 * @param cliff cliff period (months)
 * @param address unlock address
 * @param token token to use in the contract
 * @param root key to unlock funds in emergency
 * @param endContract date to complete contract
 * @returns
 */
export const createVestingContract = async (
  amount: string,
  cliff: number,
  address: string,
  token: MinimaToken,
  root: string,
  endContract: Date,
  minBlockWait: number
) => {
  try {
    // calculate block in time
    const endContractBlockHeight = await RPC.calculateBlockHeightFromDate(
      endContract
    );
    // get currentBlockHeight
    const currentBlockHeight = await RPC.getCurrentBlockHeight();

    /**
     * Calculate the Cliff period, when can the user start collecting this contract
     */
    const then = addMonths(new Date(), cliff);
    const now = new Decimal(new Date().getTime()).dividedBy(1000); // time now in seconds
    const difference = new Decimal(then.getTime()).dividedBy(1000).minus(now);
    const estimateCliffPeriod = difference.dividedBy(50);
    const startingBlockHeightOfContract = new Decimal(currentBlockHeight)
      .plus(estimateCliffPeriod)
      .round()
      .toNumber();

    /**
     * Calculate the minimum block wait the user must wait before he collects again
     */
    const minimumTimeUserMustWaitToCollectAgain = new Decimal(minBlockWait)
      .times(3600)
      .dividedBy(50);

    return new Promise((resolve, reject) => {
      MDS.cmd(
        `send debug:true amount:${amount} address:${
          vestingContract.scriptaddress
        } tokenid:${
          token.tokenid
        } state:{"0":"${address}","1":"${amount}","2":"${startingBlockHeightOfContract}", "3":"${endContractBlockHeight}","4":"${minimumTimeUserMustWaitToCollectAgain}","5":"${
          root.length === 0 ? "0x21" : root
        }"}`,
        (res) => {
          if (!res.status && !res.pending)
            reject(res.error ? res.error : "RPC Failed");
          if (!res.status && !res.pending)
            resolve(
              res.error ? res.error : res.message ? res.message : "RPC Failed"
            );
          if (!res.status && res.pending) resolve(1);

          console.log(res);
          resolve(0);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export default createVestingContract;
