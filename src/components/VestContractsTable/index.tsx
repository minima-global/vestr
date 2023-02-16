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

  events.onNewBlock(() => {});

  React.useEffect(() => {
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
      )}

      {viewCoin &&
        relevantCoins
          .filter((c) => c.coinid === viewCoin)
          .map((c) => {
            return <div>Viewing coin with coinid {c.coinid}</div>;
          })}
    </div>
  );
}
