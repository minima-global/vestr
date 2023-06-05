export const setNewScript = (script: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`newscript script:"${script}" trackall:false`, (res) => {
      if (!res.status) reject(res.error);

      resolve(res.response.address);
    });
  });
};

export default setNewScript;
