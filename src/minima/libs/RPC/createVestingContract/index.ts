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
  amount: number,
  cliff: number,
  address: string,
  token: MinimaToken,
  root: string,
  endContract: Date
) => {
  try {
    // calculate block in time
    const endContractBlockHeight = await RPC.calculateBlockHeightFromDate(
      endContract
    );
    // get currentBlockHeight
    const startingBlockHeight = await RPC.getCurrentBlockHeight();
    // calculate cliff height
    const estimateCliffPeriodBlocksPerMonth = new Decimal(cliff)
      .times(50) // seconds per block
      .times(60) // minutes per hour
      .times(24) // hours per day
      .times(30); // average days per month
    return new Promise((resolve, reject) => {
      MDS.cmd(
        `send amount:${amount} address:${
          vestingContract.scriptaddress
        } tokenid:${
          token.tokenid
        } state:{"0":"${address}","1":"${amount}","3":"${startingBlockHeight}", "4":"${endContractBlockHeight}","5":"${estimateCliffPeriodBlocksPerMonth}","6":"${
          root.length === 0 ? "0x21" : root
        }"}`,
        (res) => {
          if (!res.status) reject(res.error ? res.error : "RPC Failed");

          console.log(res);
          resolve(res.response);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export default createVestingContract;
