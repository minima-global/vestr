export const getCurrentBlockHeight = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    MDS.cmd("status", (res) => {
      if (!res.status) reject("RPC Failed");

      resolve(res.response.chain.block);
    });
  });
};

export default getCurrentBlockHeight;
