export const checkAddress = (address: string) => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`checkaddress address:${address}`, (res) => {
      if (!res.status) reject(res.error ? res.error : "RPC Failed");

      resolve(true);
    });
  });
};

export default checkAddress;
