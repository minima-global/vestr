import { Txpow } from "../../@types";
// MDS Response interfaces
interface InitResponse {
  event: "inited";
}
interface MDSFail {
  event: "MDSFAIL";
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
let whenFail = () => {
  console.log("MDS is down");
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
    "0xB2078CF98123B05D4CEDC48517703F7E560FB9C1385CE76FEB0D8E94012D5BE63C39D59441F5D731AAA630D9AF12D502A08A091D82EC1C68A8BE0B2B15D72750C84890A055CF4FF199FED6CC569FF75FB838CC2FDEA92306BCD9F700BE2ADA959EE65D07601559151F562CF136CE35A669DEF44143D1A2F5B24CFA3A1C697DBB";

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
        | MDSFail
    ) => {
      switch (nodeEvent.event) {
        case "inited":
          whenInit();
          break;
        case "MDSFAIL":
          whenFail();
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
      }
    }
  );
};

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: NewBlockData) => void) {
  whenNewBlock = callback;
}
function onFail(callback: () => void) {
  whenFail = callback;
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
  onFail,
};
