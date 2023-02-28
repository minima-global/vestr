export const runScript = async (
  script: string,
  prevstate: Object,
  globals: Object
) => {
  return new Promise((resolve, reject) => {
    // console.log(
    //   `runscript script:"${script} prevstate:${JSON.stringify(
    //     prevstate
    //   )} globals:${JSON.stringify(globals)}"`
    // );

    MDS.cmd(
      `runscript script:"${script} prevstate:${JSON.stringify(
        prevstate
      )} globals:${JSON.stringify(globals)}"`,
      (res) => {
        // console.log("runScript", res);
        if (!res.status) reject("RPC Failed");
        resolve(res.response.variables);
      }
    );
  });
};

export default runScript;
