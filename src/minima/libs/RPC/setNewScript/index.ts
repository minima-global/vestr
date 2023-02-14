export const setNewScript = (script: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(`newscript script:"${script}" trackall:false clean:true`, (res) => {
      if (!res.status) reject(res.error);

      resolve();
    });
  });
};

export default setNewScript;
