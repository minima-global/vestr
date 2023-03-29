export const hash = (data: string) => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`hash data:"${data}"`, (res) => {
      if (!res.status) reject(res.error ? res.error : "RPC Failed");

      resolve(res.response.hash);
    });
  });
};

export default hash;
