import { Txpow } from "../../@types";

////////////// response interfaces //////////
interface InitResponse {
  event: "inited";
}

interface MiningResponse {
  event: "MINING";
  data: MiningData;
}
interface MiningData {
  mining: boolean;
  txpow: Txpow;
}

interface NewBlockResponse {
  event: "NEWBLOCK";
  data: NewBlockData;
}

interface MDSTimerResponse {
  event: "MDS_TIMER_10SECONDS";
  data: Object;
}

interface NewBlockData {
  txpow: Txpow;
}

interface MinimaLogResponse {
  event: "MINIMALOG";
  data: MinimaLogData;
}
interface MinimaLogData {
  message: string;
}

interface NewBalanceResponse {
  event: "NEWBALANCE";
  data: NewBalanceData;
}
interface NewBalanceData {
  // TODO
}

interface MaximaHosts {
  event: "MAXIMAHOSTS";
  data: any;
}

interface MaximaResponse {
  event: "MAXIMA";
  data: MaximaData;
}
interface MaximaData {
  application: string;
  data: string;
  from: string;
  msgid: string;
  random: string;
  time: string;
  timemilli: number;
  to: string;
}

//////////////////////// empty functions before registration //////////////////////
let whenNewBlock = (d: NewBlockData) => {
  // console.log("NEWBLOCK event ... please resgister custom callback", d);
};
let whenMining = (d: MiningData) => {
  // console.log("MINIMG event ... please resgister custom callback", d);
};
let whenMaxima = (d: MaximaData) => {
  // console.log("MAXIMA event ... please resgister custom callback", d);
};
let whenNewBalance = (d: NewBalanceData) => {
  // console.log("NEW BALANCE event ... please resgister custom callback", d);
};
let whenInit = () => {
  console.log("INIT event ... please register custom callback");
};
let whenMinimaLog = (d: MinimaLogData) => {
  // console.log("MINIMA LOG event ... please resgister custom callback", d);
};

let whenMDSTimer = (d: any) => {
  // console.log("MINIMA MDS TIMER event ... please register custom callback", d);
};

///////////////////////////

const initializeMinima = () => {
  MDS.DEBUG_HOST = "127.0.0.1";
  MDS.DEBUG_PORT = 9003;
  MDS.DEBUG_MINIDAPPID =
    "0x9A314AAA4F4CC5C504D5B34907BEECEADED0BCAD3373030B5CB07A0A6AAFCAC178C595E3322A6EF89DD4511934BBA5BA6A01C60C84CEB3A70497C93253E3526661BFDBE0EA5503BA86E66A0AC145E4F3841DF82C445BAD7E7C2B7030C932D38E06835793D47204BBD906014EE9A8DA40C36D4B2CCD6903B224BBC131A296FA9E";

  MDS.init(
    (
      nodeEvent:
        | InitResponse
        | MiningResponse
        | NewBlockResponse
        | MinimaLogResponse
        | NewBalanceResponse
        | MaximaResponse
        | MDSTimerResponse
        | MaximaHosts
    ) => {
      switch (nodeEvent.event) {
        case "inited":
          // will have to dispatch from here..
          whenInit();
          break;
        case "NEWBLOCK":
          const newBlockData = nodeEvent.data;
          whenNewBlock(newBlockData);
          break;
        case "MINING":
          const miningData = nodeEvent.data;
          whenMining(miningData);
          break;
        case "MAXIMA":
          const maximaData = nodeEvent.data;
          whenMaxima(maximaData);
          break;
        case "NEWBALANCE":
          const newBalanceData = nodeEvent.data;

          whenNewBalance(newBalanceData);
          break;
        case "MINIMALOG":
          const minimaLogeData = nodeEvent.data;
          whenMinimaLog(minimaLogeData);
          break;
        case "MDS_TIMER_10SECONDS":
          const mdstimerdata = nodeEvent.data;
          whenMDSTimer(mdstimerdata);
          break;
        case "MAXIMAHOSTS":
          break;
        default:
        // console.error("Unknown event type: ", nodeEvent);
      }
    }
  );
};

// Do registration
// initializeMinima();

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: NewBlockData) => void) {
  whenNewBlock = callback;
}

function onMining(callback: (data: MiningData) => void) {
  whenMining = callback;
}

function onMaxima(callback: (data: MaximaData) => void) {
  whenMaxima = callback;
}

function onNewBalance(callback: (data: NewBalanceData) => void) {
  whenNewBalance = callback;
}

function onInit(callback: () => void) {
  whenInit = callback;

  initializeMinima();
}

function onMDSTimer(callback: (data: any) => void) {
  whenMDSTimer = callback;
}

function onMinimaLog(callback: (data: MinimaLogData) => void) {
  whenMinimaLog = callback;
}

export const events = {
  onNewBlock,
  onMining,
  onMaxima,
  onNewBalance,
  onInit,
  onMinimaLog,
  onMDSTimer,
};
