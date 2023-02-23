import { getCurrentBlockHeight } from "./../getCurrentBlockHeight/index";
import { vestingContract } from "../../contracts";

export const runScript = async (
  script: string,
  prevstate: Object,
  globals: Object
) => {
  // console.log("script", script);
  // console.log("prevstate", prevstate);
  // console.log("globals", globals);
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
        if (!res.status) reject("RPC Failed");
        // console.log(res);
        resolve(res.response.variables);
      }
    );
  });
};

export default runScript;
