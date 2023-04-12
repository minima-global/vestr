export const runScript = async (
  script: string,
  prevstate: Object,
  globals: Object
) => {
  return new Promise((resolve, reject) => {
    MDS.cmd(
      `runscript script:"${script} prevstate:${JSON.stringify(
        prevstate
      )} globals:${JSON.stringify(globals)}"`,
      (res) => {
        if (!res.status) reject("RPC Failed");
        resolve(res.response.variables);
      }
    );
  });
};

export default runScript;
