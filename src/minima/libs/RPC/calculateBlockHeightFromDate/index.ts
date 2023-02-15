import Decimal from "decimal.js";
import getCurrentBlockHeight from "../getCurrentBlockHeight";

export const calculateBlockHeightFromDate = async (
  dateTimeChosenByUser: Date
): Promise<number> => {
  try {
    // get current time
    const now = new Date().getTime();
    const then = dateTimeChosenByUser.getTime();
    const currentBlockHeight = await getCurrentBlockHeight();
    const duration = new Decimal(now).minus(new Decimal(then));

    if (duration.lessThanOrEqualTo(0)) {
      throw new Error(
        "You have to send cash to the future, not the present or the past."
      );
    }

    const calculatedBlocktime = new Decimal(duration).dividedBy(50 * 1000);

    return calculatedBlocktime.add(currentBlockHeight).round().toNumber();
  } catch (err: any) {
    const errorMessage = err && err.message ? err.message : err;
    throw new Error(errorMessage);
  }
};

export default calculateBlockHeightFromDate;
