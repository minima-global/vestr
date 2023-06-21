import { addMinutes } from "date-fns";
import { MinimaToken } from "../../../../@types";
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
  cliff: { quantity: number; period: number },
  address: string,
  token: MinimaToken,
  datetime: Date,
  minBlockWait: number,
  id: string,
  uid: string,
  scriptAddress: string,
  password: string
): Promise<0 | 1> => {
  try {
    const endContractBlockHeight = await RPC.calculateBlockHeightFromDate(
      datetime
    );
    console.log("EndContractBlockHeight", endContractBlockHeight);
    const currentBlockHeight = await RPC.getCurrentBlockHeight();
    console.log("CurrentBlockHeight", currentBlockHeight);

    /**
     * Calculate the Cliff period, when can the user start collecting this contract
     * Can be in days, weeks or months
     */
    const cliffAlreadyInMinutes = cliff.period === 0;
    console.log("cliffAlreadyInMinutes", cliffAlreadyInMinutes);
    const cliffInMinutes = new Decimal(cliff.quantity)
      .times(cliffAlreadyInMinutes ? 1 : cliff.period)
      .toNumber();
    console.log("cliffInMinutes", cliffInMinutes);
    const then = addMinutes(new Date(), cliffInMinutes);
    console.log("When the cliff ends", then);
    const now = new Decimal(new Date().getTime()).dividedBy(1000); // time now in seconds
    console.log("time now", now);
    const difference = new Decimal(then.getTime()).dividedBy(1000).minus(now);
    console.log("te difference", difference);
    const estimateCliffPeriodInBlocks = difference.dividedBy(50);
    console.log("estimatedCliffPeriodInBlocks", estimateCliffPeriodInBlocks);
    const startingBlockHeightOfContract = new Decimal(currentBlockHeight)
      .plus(estimateCliffPeriodInBlocks)
      .round()
      .toNumber();
    console.log("Start of contract bloks", startingBlockHeightOfContract);

    console.log("Contracts end son block", endContractBlockHeight);
    /**
     * Calculate the minimum block wait the user must wait before he collects again
     */
    const minimumTimeUserMustWaitToCollectAgain = new Decimal(minBlockWait)
      .times(3600)
      .dividedBy(50);

    return new Promise((resolve, reject) => {
      MDS.cmd(
        `send debug:false ${
          password.length ? "password:" + password : ""
        } amount:${amount} address:${scriptAddress} tokenid:${
          token.tokenid
        } state:{"0":"${address}","1":"${amount}","2":"${startingBlockHeightOfContract}", "3":"${endContractBlockHeight}","4":"${minimumTimeUserMustWaitToCollectAgain}","5":"${new Date().getTime()}","6":"${cliffInMinutes}","7":"${minBlockWait}","8":"${datetime.getTime()}", "199":"${uid}"}`,
        (res) => {
          console.log(res);
          if (!res.status && !res.pending)
            reject(
              res.error ? res.error : res.message ? res.message : "RPC Failed"
            );

          if (!res.status && res.pending) resolve(1);

          resolve(0);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export default createVestingContract;
