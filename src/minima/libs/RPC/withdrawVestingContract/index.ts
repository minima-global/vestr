import { vestingContract } from "../../contracts";

export const withdrawVestingContract = (
  coin: any,
  cancollect: number,
  root: boolean
) => {
  const coinid = coin.coinid;
  const withdrawalAddress = coin.state[0].data;
  const tokenid = coin.tokenid;
  const amountRemaining = coin.amount;
  const rootKey = coin.state[5].data;

  console.log(`Collecting amount..`, cancollect);

  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000000);
    let change = amountRemaining - cancollect;
    // calculate change

    const command = `
            txncreate id:${id};
            txninput id:${id} coinid:${coinid} scriptmmr:true;
            txnoutput id:${id} address:${withdrawalAddress} amount:${cancollect} tokenid:${tokenid} storestate:false;
            ${
              change && change > 0
                ? `txnoutput id:${id} address:${vestingContract.scriptaddress} amount:${change} tokenid:${tokenid} storestate:true;`
                : ""
            }
            ${root ? `txnsign id:${id} publickey:${rootKey};` : ""}
            txnpost id:${id}
        `;

    MDS.cmd(command, (res) => {
      console.log(res);
      const multiResponse = res.length > 1;
      if (!multiResponse && !res.status) reject("RPC Failed");
      if (multiResponse) {
        res.map((r: any) => {
          // iterate through each response.. if you find an error, reject
          if (!r.status) {
            const error = r.error
              ? r.error
              : r.message
              ? r.message
              : `${r.command} failed`;
            reject(error);
          }
        });
      }

      resolve(true);
    });
  });
};

export default withdrawVestingContract;
