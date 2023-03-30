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
  const tokenid = coin.tokenid;
  const withdrawalAddress = MDS.util.getStateVariable(coin, 0);
  const rootKey = MDS.util.getStateVariable(coin, 5);

  return new Promise((resolve, reject) => {
    // reject("Failed purposefully");
    const id = Math.floor(Math.random() * 1000000000);
    const command = `
            txncreate id:${id};
            txninput id:${id} coinid:${coinid} scriptmmr:true;
            txnoutput id:${id} address:${withdrawalAddress} amount:${cancollect} tokenid:${tokenid} storestate:false;
            ${
              change && new Decimal(change).greaterThan(0)
                ? `
                txnoutput id:${id} address:${vestingContract.scriptaddress} amount:${change} tokenid:${tokenid} storestate:true;          
                `
                : ""
            }
            txnstate id:${id} port:0 value:${MDS.util.getStateVariable(
      coin,
      0
    )};
            txnstate id:${id} port:1 value:${MDS.util.getStateVariable(
      coin,
      1
    )};
            txnstate id:${id} port:2 value:${MDS.util.getStateVariable(
      coin,
      2
    )};
            txnstate id:${id} port:3 value:${MDS.util.getStateVariable(
      coin,
      3
    )};
            txnstate id:${id} port:4 value:${MDS.util.getStateVariable(
      coin,
      4
    )};                
            txnstate id:${id} port:5 value:${MDS.util.getStateVariable(
      coin,
      5
    )};      
            txnstate id:${id} port:6 value:${MDS.util.getStateVariable(
      coin,
      6
    )};      
            txnstate id:${id} port:7 value:${MDS.util.getStateVariable(
      coin,
      7
    )};      
            txnstate id:${id} port:199 value:${MDS.util.getStateVariable(
      coin,
      199
    )};      
            
            ${
              root
                ? `txnsign id:${id} publickey:${rootKey} txnpostauto:false;`
                : ""
            }
            ${!root ? `txnpost id:${id};` : ""}
            txndelete id:${id}
        `;

    MDS.cmd(command, (res) => {
      console.log(res);
      const multiResponse = res.length > 1;
      if (!multiResponse && !res.status)
        reject(res.error ? res.error : "RPC Failed");

      if (multiResponse) {
        res.map((r: any) => {
          if (!r.status && r.pending) {
            resolve(1);
          }
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

      resolve(0);
    });
  });
};

export default withdrawVestingContract;
