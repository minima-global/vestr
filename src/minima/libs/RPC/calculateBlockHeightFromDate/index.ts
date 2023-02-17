import Decimal from "decimal.js";
import getCurrentBlockHeight from "../getCurrentBlockHeight";

export const calculateBlockHeightFromDate = async (
  dateTimeChosenByUser: Date
): Promise<number> => {
  try {
    // get current time
    const now = new Decimal(new Date().getTime()).dividedBy(1000);
    console.log(`time now in seconds`, now.toNumber());
    const then = new Decimal(dateTimeChosenByUser.getTime()).dividedBy(1000);
    console.log(`time then in seconds`, then.toNumber());
    const currentBlockHeight = await getCurrentBlockHeight();
    const duration = then.minus(now);
    console.log(
      "Duration calculated by minusing future from now",
      duration.toNumber()
    );
    if (duration.lessThanOrEqualTo(0)) {
      throw new Error(
        "You have to send cash to the future, not the present or the past."
      );
    }

    const calculatedBlockHeight = duration.dividedBy(50);

    return new Decimal(currentBlockHeight)
      .add(calculatedBlockHeight)
      .round()
      .toNumber();
  } catch (err: any) {
    const errorMessage = err && err.message ? err.message : err;
    throw new Error(errorMessage);
  }
};

export default calculateBlockHeightFromDate;
