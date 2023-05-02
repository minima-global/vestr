import Decimal from "decimal.js";

Decimal.set({ precision: 64 });
export const calculateVestingSchedule = async (
  amount: string,
  // launchPercentage: number,
  contractLength: string
) => {
  // are they receiving a lump sum token payment
  // const initialPayment = new Decimal(amount).times(launchPercentage);
  const totalLockedAmount = new Decimal(amount);
  const startBlock = 0;
  const oneMonthInBlocks = 51840;
  const finalBlock = new Decimal(contractLength)
    .times(30) // days
    .times(24) // hours
    .times(60) // mins
    .times(60) // secs
    .dividedBy(50);
  // how much are they getting monthly
  const totalDuration = finalBlock.minus(startBlock);
  const payPerBlock = totalLockedAmount.dividedBy(totalDuration);
  const payPerMonth = payPerBlock.times(oneMonthInBlocks);

  return {
    // launchPercentage: launchPercentage,
    totalLockedAmount: amount,
    // initialPayout: initialPayment.toNumber(),
    paymentPerBlock: payPerBlock.toNumber(),
    paymentPerMonth: payPerMonth.toNumber(),
    contractLength: contractLength,
  };
};

export default calculateVestingSchedule;
