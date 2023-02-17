export const getCoinsByAddress = (address: string) => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`coins address:${address} relevant:true`, (res) => {
      if (!res.status) reject("RPC Failed");

      resolve({
        address: res.params.address,
        relevantCoins: res.response,
      });
    });
  });
};

export default getCoinsByAddress;
