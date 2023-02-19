export const getAddress = () => {
  return new Promise((resolve, reject) => {
    MDS.cmd("getaddress", (res) => {
      if (!res.status) reject("RPC Failed");

      resolve(res.response);
    });
  });
};

export default getAddress;
