import Decimal from "decimal.js";
import getCurrentBlockHeight from "../getCurrentBlockHeight";

export const calculateBlockHeightFromDate = async (
  datetime: Date
): Promise<number> => {
  try {
    const now = new Decimal(new Date().getTime()).dividedBy(1000);
    const then = new Decimal(datetime.getTime()).dividedBy(1000);
    const currentBlockHeight = await getCurrentBlockHeight();
    const duration = then.minus(now);
    const calculatedBlockHeight = duration.dividedBy(50);

    return new Decimal(currentBlockHeight)
      .add(calculatedBlockHeight)
      .round()
      .toNumber();
  } catch (error) {
    return 0;
  }
};

export default calculateBlockHeightFromDate;
