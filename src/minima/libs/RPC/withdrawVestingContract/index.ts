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
            txnpost id:${id};
            txndelete id:${id}
        `;

    MDS.cmd(command, (res) => {
      if (!res.status) reject("RPC Failed");
      console.log(res);
      resolve(res.response);
    });
  });
};

export default withdrawVestingContract;
