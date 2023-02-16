import { vestingContract } from "../../contracts";

export const withdrawVestingContract = (coin: any, cancollect: number) => {
  const coinid = coin.coinid;
  const withdrawalAddress = coin.state[0].data;
  const tokenid = coin.tokenid;
  const amountRemaining = coin.amount;

  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000000);
    let change = amountRemaining - cancollect;
    // calculate change

    const command = `
            txncreate id:${id};
            txninput id:${id} coinid:${coinid};
            txnoutput id:${id} address:${withdrawalAddress} amount:${cancollect} tokenid:${tokenid} storestate:false;
            ${
              change && change > 0
                ? `txnoutput id:${id} address:${vestingContract.scriptaddress} amount:${change} tokenid:${tokenid} storestate:true;`
                : ""
            }
            txnbasics id:${id};
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
