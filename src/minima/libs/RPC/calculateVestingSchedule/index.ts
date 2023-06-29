import Decimal from "decimal.js";
import calculateBlockHeightFromDate from "../calculateBlockHeightFromDate";

Decimal.set({ precision: 64 });
export const calculateVestingSchedule = async (
  amount: number,
  start: Date,
  end: Date
) => {
  const totalLockedAmount = new Decimal(amount);
  const startBlocks = await calculateBlockHeightFromDate(start);
  const finalBlocks = await calculateBlockHeightFromDate(end);
  const length = new Decimal(finalBlocks).minus(startBlocks);
  const payPerBlock = totalLockedAmount.dividedBy(length);

  return {
    totalLockedAmount: amount,
    paymentPerBlock: payPerBlock.toNumber(),
    contractLength: length,
  };
};

export default calculateVestingSchedule;
