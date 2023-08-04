import Decimal from "decimal.js";
import calculateBlockHeightFromDate from "../calculateBlockHeightFromDate";

Decimal.set({ precision: 64 });
export const calculateVestingSchedule = async (
  amount: number,
  start: Date,
  end: Date,
  grace: number
) => {
  const totalLockedAmount = new Decimal(amount);
  const startBlocks = await calculateBlockHeightFromDate(start);
  const finalBlocks = await calculateBlockHeightFromDate(end);
  const length = new Decimal(finalBlocks).minus(startBlocks);
  const gracePeriodInBlocks = new Decimal(grace).times(3600).dividedBy(50);
  const paymentRatio = gracePeriodInBlocks
    .dividedBy(length)
    .times(totalLockedAmount);

  return {
    totalLockedAmount: amount,
    contractLength: length,
    paymentPerGrace: paymentRatio.lessThan(totalLockedAmount)
      ? paymentRatio.toNumber()
      : totalLockedAmount.toNumber(),
  };
};

export default calculateVestingSchedule;
