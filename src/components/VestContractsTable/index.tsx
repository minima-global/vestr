import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { events } from "../../minima/libs/events";
import { vestingContract } from "../../minima/libs/contracts";
import * as RPC from "../../minima/libs/RPC";
import styles from "./VestContractsTable.module.css";
import { Button, Stack } from "@mui/material";
import { getCurrentBlockHeight } from "../../minima/libs/RPC";
import Decimal from "decimal.js";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function DataTable() {
  const [relevantCoins, setRelevantCoins] = React.useState<any[]>([]);

  const [error, setError] = React.useState<false | string>(false);
  const [viewCoin, setView] = React.useState<false | string>(false);
  const [canCollect, setCanCollect] = React.useState<false | number>(false);

  const collectCoin = async (coin: any, cancollect: any) => {
    setError(false);
    try {
      await RPC.withdrawVestingContract(coin, cancollect);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err && err.message ? err.message : err ? err : "Failed to withdraw";
      setError(errorMessage);
    }
  };

  events.onNewBlock(() => {});

  React.useEffect(() => {
    relevantCoins
      .filter((c) => c.coinid === viewCoin)
      .map(async (c) => {
        let canCollect = await calculateBlockWithdrawalAmount(
          parseInt(c.state[3].data),
          parseInt(c.state[2].data),
          parseInt(c.state[1].data),
          parseInt(c.amount)
        );
        setCanCollect(canCollect);
      });
  }, [viewCoin]);

  React.useEffect(() => {
    setView(false);

    RPC.getCoinsByAddress(vestingContract.scriptaddress)
      .then((result: any) => {
        console.log(result);
        setRelevantCoins(result.relevantCoins);
      })
      .catch((err) => {
        const errorMessage =
          err && err.message ? err.message : err ? err : "Failed to fetch data";
        setError(errorMessage);
      });
  }, []);

  return (
    <div className={styles["table-wrapper"]}>
      {!viewCoin && (
        <>
          {error && <div>{error}</div>}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Contract</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Token ID</TableCell>
                  <TableCell align="right">Contract Start</TableCell>
                  <TableCell align="right">Contract Ends</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {relevantCoins.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {i}
                    </TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.tokenid}</TableCell>
                    <TableCell align="right">{row.state[2].data}</TableCell>
                    <TableCell align="right">{row.state[3].data}</TableCell>
                    <TableCell align="right">
                      <button
                        onClick={() => {
                          setView(row.coinid);
                        }}
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {viewCoin &&
        relevantCoins
          .filter((c) => c.coinid === viewCoin)
          .map((c, i) => {
            return (
              <>
                <Stack className={styles["view"]} spacing={4}>
                  {error && <div>{error}</div>}
                  <Stack
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <h6>Contract {c.coinid}</h6>
                    <button
                      className={styles["back-btn"]}
                      onClick={() => setView(false)}
                    >
                      Go back
                    </button>
                  </Stack>

                  <Stack>
                    <ul>
                      <li>
                        <h6>Total Amount Locked</h6>
                        <p>{c.amount}</p>
                      </li>
                      <li>
                        <h6>Contract Starts</h6>
                        <p>{c.state[2].data}</p>
                      </li>
                      <li>
                        <h6>Contract Ends</h6>
                        <p>{c.state[3].data}</p>
                      </li>
                      <li>
                        <h6>Cliff Period</h6>
                        <p>{c.state[4].data}</p>
                      </li>
                      <li>
                        <h6>Root Key</h6>
                        <p>{c.state[5].data}</p>
                      </li>
                      <li>
                        <h6>Withdrawal Address</h6>
                        <p>{c.state[0].data}</p>
                      </li>
                      <li>
                        <h6>Can Withdraw now</h6>
                        <p>
                          {canCollect ? canCollect + " / " + c.amount : "N/a"}
                        </p>
                      </li>
                    </ul>
                  </Stack>
                  <Button
                    type="button"
                    disableElevation
                    fullWidth
                    color="inherit"
                    variant="contained"
                    onClick={() => collectCoin(c, canCollect)}
                  >
                    Withdraw
                  </Button>
                </Stack>
              </>
            );
          })}
    </div>
  );
}

const calculateBlockWithdrawalAmount = async (
  finalBlock: number,
  startBlock: number,
  totalAmountLocked: number,
  currentCoinAmount: number
) => {
  try {
    const currentBlockHeight = await getCurrentBlockHeight();

    let totalduration = new Decimal(finalBlock).minus(new Decimal(startBlock));
    let blockamount = new Decimal(0);

    if (totalduration.lessThanOrEqualTo(0)) {
      blockamount = new Decimal(totalAmountLocked);
    }

    if (totalduration.greaterThan(0)) {
      blockamount = new Decimal(totalAmountLocked).dividedBy(
        new Decimal(totalduration)
      );
    }

    let totalAmountTime = currentBlockHeight - startBlock;
    let totalOwedAmount = new Decimal(totalAmountTime).times(blockamount);
    let alreadyCollected = totalAmountLocked - currentCoinAmount;
    let canCollect = new Decimal(totalOwedAmount).minus(alreadyCollected);

    console.log("Amount can collect", canCollect.toNumber());

    return canCollect.toNumber();
  } catch (error) {
    throw error;
  }
};
