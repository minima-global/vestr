import { vestingContract } from "../../contracts";
import Decimal from "decimal.js";

export const withdrawVestingContract = (
  coin: any,
  cancollect: string,
  change: string,
  root: boolean,
  state: any[]
) => {
  const coinid = coin.coinid;
  const withdrawalAddress = coin.state[0].data;
  const tokenid = coin.tokenid;
  const rootKey = coin.state[5].data;

  console.log(`Collecting amount..`, cancollect);

  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000000);
    console.log("CHANGE1212", change);
    const command = `
            txncreate id:${id};
            txninput id:${id} coinid:${coinid} scriptmmr:true;
            txnoutput id:${id} address:${withdrawalAddress} amount:${cancollect} tokenid:${tokenid} storestate:false;
            ${
              change && new Decimal(change).greaterThan(0)
                ? `
                txnoutput id:${id} address:${vestingContract.scriptaddress} amount:${change} tokenid:${tokenid} storestate:true;
                txnstate id:${id} port:0 value:${state[0].data};
                txnstate id:${id} port:1 value:${state[1].data};
                txnstate id:${id} port:2 value:${state[2].data};
                txnstate id:${id} port:3 value:${state[3].data};
                txnstate id:${id} port:4 value:${state[4].data};                
                txnstate id:${id} port:5 value:${state[5].data};                
                `
                : ""
            }
            
            ${root ? `txnsign id:${id} publickey:${rootKey};` : ""}
            txnpost id:${id};
            txndelete id:${id}
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
