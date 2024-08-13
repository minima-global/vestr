import { useContext, useState } from "react";

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isPast,
} from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { Coin } from "../../@types";
import styles from "./ContractDetails.module.css";
import Decimal from "decimal.js";

import useContractCalculation from "../../hooks/useContractCalculation";

import { gracePeriods } from "../../components/gracePeriod";
import { copy } from "../../utils/utils";

import * as RPC from "../../minima/libs/RPC";

import Success from "../../components/UI/Lottie/Success.json";
import Loading from "../../components/UI/Lottie/Loading.json";
import Failed from "../../components/UI/Lottie/Error.json";
// import Pending from "../../UI/Lottie/Pending.json";
import Lottie from "lottie-react";
import { appContext } from "../../AppContext";
import FireIcon from "../../components/UI/Icons/FireIcon";
import AnimatedDialog from "../../components/AnimatedDialog";
import CloseIcon from "../../components/UI/Icons/CloseIcon";
import AnimateFadeIn from "../../components/UI/Animations/AnimateFadeIn";
import BackIcon from "../../components/UI/Icons/BackIcon";
import RefreshIcon from "../../components/UI/Icons/RefreshIcon";
import EditNickname from "./EditNickname";
import EditIcon from "../../components/UI/Icons/EditIcon";

export function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

const ContractDetails = () => {
  const navigate = useNavigate();
  const {
    scriptAddress,
    walletBalance: wallet,
    promptEditNickname,
    _contractNicknames,
  } = useContext(appContext);
  const [seeDetails, setDetails] = useState(false);

  const { contracts, tip } = useContext(appContext);

  const [copyButton, setCopy] = useState({
    tokenid: false,
    coinid: false,
    address: false,
  });

  const [prompt, setPrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [finish, setFinished] = useState(false);

  const [error, setError] = useState<
    { burn?: string; submit?: string } | false
  >(false);

  const [burn, setBurn] = useState("");

  const { id } = useParams();

  const { notFound, loading, contract, calculatedData }: any =
    useContractCalculation(id);

  if (loading && !contract) {
    return (
      <div className="h-full flex justify-center items-center gap-1 text-neutral-500">
        <span className="animate-spin">
          <RefreshIcon size={12} fill="currentColor" />
        </span>
        <p>Looking for your contract</p>
      </div>
    );
  }

  // If contract id is not defined
  if (notFound) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-center text-neutral-400">Contract not found</p>
      </div>
    );
  }

  const handleCopy = (text: string, button: string) => {
    if (button === "tokenid") setCopy({ ...copyButton, tokenid: true });
    if (button === "coinid") setCopy({ ...copyButton, coinid: true });
    if (button === "address") setCopy({ ...copyButton, address: true });

    copy(text);

    setTimeout(() => {
      if (button === "tokenid") setCopy({ ...copyButton, tokenid: false });
      if (button === "coinid") setCopy({ ...copyButton, coinid: false });
      if (button === "address") setCopy({ ...copyButton, address: false });
    }, 2000);
  };

  const handleCollectionPrompt = () => {
    setPrompt(true);
  };

  const isNumber = (value: string): boolean => {
    const numberPattern = /^\d+(\.\d+)?$/;
    return numberPattern.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    try {
      setBurn(value);

      if (!value) {
        return setError(false);
      }

      if (!isNumber(value)) {
        throw new Error("Please enter a valid number");
      }

      const burnValue = new Decimal(value);
      const walletAmount = new Decimal(wallet[0]?.sendable || 0);

      if (burnValue.greaterThan(walletAmount)) {
        throw new Error("You don't have enough MINIMA to collect this coin");
      }

      setBurn(value);
      setError(false);
    } catch (err: any) {
      if (err instanceof Error) {
        setError((prevError) => ({
          ...prevError,
          burn: err.message,
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          burn: "Invalid amount",
        }));
      }
    }
  };

  const reset = () => {
    setSubmitting(false);
    setSuccess(false);
    setError(false);
    setFinished(false);
    setPrompt(false);
  };

  const handleCollect = async (coin: Coin) => {
    setSubmitting(true);

    try {
      const finalBlock = MDS.util.getStateVariable(coin, 3);
      const contractHasExpired = new Decimal(tip).greaterThanOrEqualTo(
        finalBlock
      );

      if (contractHasExpired) {
        const collectable =
          coin.tokenid === "0x00" ? coin.amount : coin.tokenamount;

        await RPC.withdrawVestingContract(
          coin,
          collectable!,
          false,
          scriptAddress,
          burn
        ).catch((err) => {
          throw new Error(err);
        });
        setSubmitting(false);
        setSuccess(true);
      }

      if (!contractHasExpired) {
        await RPC.withdrawVestingContract(
          coin,
          calculatedData.cancollect,
          calculatedData.change,
          scriptAddress,
          burn
        ).catch((err) => {
          throw new Error(err);
        });
        setSubmitting(false);
        setSuccess(true);
      }

      // has the contract been fully collected ?
      const contractFinished = !contracts.get(id);

      if (contractFinished) {
        setFinished(true);
      }
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes("coin not found")) {
          setFinished(true);
        }
      }

      setSubmitting(false);
      setError({ ...error, submit: error.message });
    }
  };

  const youCollected = new Decimal(MDS.util.getStateVariable(contract, 1))
    .minus(contract.tokenid === "0x00" ? contract.amount : contract.tokenamount)
    .toString();

  const totalContract = new Decimal(
    MDS.util.getStateVariable(contract, 1)
  ).toString();

  return (
    <>
      <AnimatedDialog display={prompt} dismiss={() => setPrompt(false)}>
        <div className="my-4 mx-4 md:mx-0 grid grid-rows-[auto_3fr_auto] sm:block h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
              Collect from Vested Contract
            </h2>
            {!submitting && (
              <span onClick={reset}>
                <CloseIcon fill="currentColor" />
              </span>
            )}
          </div>

          {finish && (
            <>
              <div className="flex flex-col justify-start items-center">
                <Lottie
                  className="w-[120px] h-[120px]"
                  animationData={Success}
                  loop={false}
                />
                <p className="text-center">
                  Contract has been fully collected once the transaction is
                  confirmed
                </p>
              </div>
              <div className="my-4 gap-3 sm:mt-16">
                <div className="mb-8">
                  <button
                    className="w-full bg-black text-white tracking-wide p-4 py-3 rounded-md"
                    onClick={() => {
                      reset();

                      navigate("/dashboard/about/collector");
                    }}
                  >
                    Go back
                  </button>
                </div>
              </div>
            </>
          )}

          {submitting && (
            <>
              <div className="flex flex-col justify-start items-center">
                <Lottie
                  className="w-[120px] h-[120px]"
                  animationData={Loading}
                  loop={true}
                />
                <p className="text-center">Collecting...</p>
              </div>
            </>
          )}

          {success && (
            <>
              <div className="flex flex-col justify-start items-center">
                <Lottie
                  className="w-[120px] h-[120px]"
                  animationData={Success}
                  loop={false}
                />
                <p className="text-center">
                  Transaction submitted to the network, once confirmed your
                  wallet will update.
                </p>
              </div>
              <div className="my-4 gap-3 sm:mt-16">
                <div className="mb-8">
                  <button
                    className="w-full bg-black text-white tracking-wide p-4 py-3 rounded-md"
                    onClick={reset}
                  >
                    Go back
                  </button>
                </div>
              </div>
            </>
          )}

          {error && error.submit && (
            <>
              <div className="flex flex-col justify-start items-center">
                <Lottie
                  className="w-[120px] h-[120px]"
                  animationData={Failed}
                  loop={false}
                />
                <p className="text-center break-all">{error.submit}</p>
              </div>
              <div className="my-4 gap-3 sm:mt-16">
                <div className="mb-8">
                  <button
                    className="w-full bg-black text-white tracking-wide p-4 py-3 rounded-md"
                    onClick={reset}
                  >
                    Go back
                  </button>
                </div>
              </div>
            </>
          )}

          {!submitting && !error && !success && !finish && (
            <>
              <p>
                Collecting{" "}
                <span className="tracking-wider">
                  {calculatedData?.cancollect}
                </span>
                <span className="font-bold">
                  {contract?.tokenid === "0x00"
                    ? " MINIMA "
                    : contract?.token &&
                      typeof contract?.token.name === "string"
                    ? contract?.token.name
                    : " TOKEN "}{" "}
                </span>
                from the vested contract.
              </p>
              <div className="my-4 gap-3 sm:mt-16">
                <div className="my-2 w-full flex">
                  <p className="text-sm my-auto text-black">
                    Network
                    <br /> fee
                  </p>
                  <div className="ml-auto">
                    <span className="flex justify-end text-orange-500">
                      <FireIcon size={22} fill="currentColor" />
                    </span>
                    <span className="font-mono">
                      {burn.length ? burn : "0.0"}
                    </span>
                    {" MINIMA"}
                  </div>
                  {contract?.tokenid !== "0x00" && (
                    <span className="mr-2">
                      <img
                        className="w-6 h-6"
                        src={`/assets/tokens/${contract?.tokenid}.svg`}
                        alt="token"
                      />
                    </span>
                  )}
                </div>
                <div className="mb-8">
                  <button
                    className="p-2 tracking-wide disabled:opacity-30 hover:bg-yellow-300 focus:outline-none bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center justify-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
                    onClick={() => handleCollect(contract)}
                  >
                    Collect
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </AnimatedDialog>

      <EditNickname id={MDS.util.getStateVariable(contract, 199)} />

      <AnimateFadeIn display={contract}>
        <section className={`${styles.grid}`}>
          <section>
            <div>
              <button
                className="p-0 m-0 font-bold tracking-wide flex items-center gap-1 hover:text-opacity-80"
                type="button"
                onClick={() => navigate(-1)}
              >
                <span className="text-black">
                  <BackIcon fill="currentColor" />
                </span>
                Back
              </button>
            </div>

            {loading && (
              <div className="flex justify-center items-center gap-1 text-sm text-neutral-500">
                <span className="animate-spin">
                  <RefreshIcon size={16} fill="currentColor" />
                </span>
                <p>Refreshing data...</p>
              </div>
            )}

            <section>
              <div className="flex items-center mt-4 mb-0 gap-2">
                <h6 className="m-0 font-bold tracking-wide truncate">
                  <span className="max-w-[20ch] sm:max-w-[25ch]">
                    {(_contractNicknames &&
                      _contractNicknames[
                        MDS.util.getStateVariable(contract, 199)
                      ]) ||
                      "Contract"}
                  </span>{" "}
                  details
                </h6>

                <span onClick={promptEditNickname}>
                  <EditIcon fill="currentColor" />
                </span>
              </div>
              <ul>
                {calculatedData && (
                  <li className="divide-y space-y-1 !bg-white  mb-2">
                    <div className="text-center tracking-wider grid !grid-cols-2 truncate">
                      <p className="!text-sm">I collected</p>
                      <p className="!text-sm">Vested</p>
                    </div>
                    <div className="grid !grid-cols-2 text-center font-mono text-lg tracking-wide divide-x-2 pt-2 truncate">
                      <p className="!font-bold truncate">{youCollected}</p>
                      <p className="!font-bold truncate">{totalContract}</p>
                    </div>
                  </li>
                )}

                {calculatedData && (
                  <li
                    className={`${
                      calculatedData.cancollect <= 0 ||
                      calculatedData.mustwait === "TRUE"
                        ? ""
                        : styles["golden"]
                    }`}
                  >
                    <h6>Tokens available to collect</h6>
                    <p>
                      {calculatedData.cancollect <= 0 ||
                      calculatedData.mustwait === "TRUE"
                        ? 0
                        : calculatedData.cancollect}
                    </p>
                  </li>
                )}
                <li>
                  <h6>Tokens remaining</h6>
                  {contract?.tokenid === "0x00" && <p>{contract.amount}</p>}
                  {contract?.tokenid !== "0x00" && contract.tokenamount && (
                    <p>{contract.tokenamount}</p>
                  )}
                </li>
                <li>
                  <h6>Contract ID</h6>
                  <input
                    readOnly
                    value={MDS.util.getStateVariable(contract, 199)}
                    className="w-full bg-transparent focus:outline-none truncate"
                  />
                </li>
                <li>
                  <h6>Token name</h6>
                  {contract?.tokenid === "0x00" && <p>Minima</p>}
                  {contract?.tokenid !== "0x00" && (
                    <p>
                      {contract.token.name && contract.token.name.name
                        ? contract.token.name.name
                        : "N/A"}
                    </p>
                  )}
                </li>
              </ul>
            </section>
            {calculatedData && (
              <section>
                <h6
                  className={styles["show-details"]}
                  onClick={() => setDetails((p) => !p)}
                >
                  {!seeDetails ? "More" : "Hide"} details{" "}
                  <img
                    className={seeDetails ? styles.active : styles.passive}
                    alt="arrow-down"
                    src="./assets/expand_more.svg"
                  />
                </h6>
                {seeDetails && (
                  <ul className={styles["hidden-details"]}>
                    <li>
                      <h6>Tokens collected</h6>
                      {youCollected}
                    </li>
                    <li>
                      <h6>Contract amount</h6>
                      <p>
                        {new Decimal(
                          MDS.util.getStateVariable(contract, 1)
                        ).toString()}
                      </p>
                    </li>
                    <li>
                      <h6>Created</h6>
                      <p>
                        {format(
                          parseInt(MDS.util.getStateVariable(contract, 5)),
                          `dd MMMM yyyy `
                        )}
                        at
                        {format(
                          parseInt(MDS.util.getStateVariable(contract, 5)),
                          ` hh:mm:ss a`
                        )}
                      </p>
                    </li>
                    <li>
                      <h6>
                        {isPast(
                          parseInt(MDS.util.getStateVariable(contract, 6))
                        )
                          ? "Contract started"
                          : "Contract starts"}
                      </h6>
                      <p>
                        {format(
                          parseInt(MDS.util.getStateVariable(contract, 6)),
                          "dd MMMM yyyy"
                        )}{" "}
                        at
                        {format(
                          parseInt(MDS.util.getStateVariable(contract, 6)),
                          " hh:mm:ss a"
                        )}
                        {" ("}
                        {(() => {
                          const startDate = parseInt(
                            MDS.util.getStateVariable(contract, 6)
                          );
                          const now = new Date();

                          const daysDifference = differenceInDays(
                            now,
                            startDate
                          );
                          if (daysDifference === 0) {
                            const hoursDifference = differenceInHours(
                              now,
                              startDate
                            );
                            if (hoursDifference === 0) {
                              const minutesDifference = differenceInMinutes(
                                now,
                                startDate
                              );
                              if (minutesDifference === 0) {
                                const secondsDifference = differenceInSeconds(
                                  now,
                                  startDate
                                );
                                return `${
                                  secondsDifference >= 0
                                    ? `${secondsDifference} seconds ago`
                                    : `in ${Math.abs(
                                        secondsDifference
                                      )} seconds`
                                }`;
                              }
                              return `${
                                minutesDifference >= 0
                                  ? `${minutesDifference} minutes ago`
                                  : `in ${Math.abs(minutesDifference)} minutes`
                              }`;
                            }
                            return `${
                              hoursDifference >= 0
                                ? `${hoursDifference} hours ago`
                                : `in ${Math.abs(hoursDifference)} hours`
                            }`;
                          }
                          return `${
                            daysDifference >= 0
                              ? `${daysDifference} days ago`
                              : `in ${Math.abs(daysDifference)} days`
                          }`;
                        })()}
                        {")"}
                      </p>
                    </li>
                    <li>
                      <h6>Contract ends</h6>
                      <p>
                        {format(
                          parseInt(MDS.util.getStateVariable(contract, 8)),
                          "dd MMMM yyyy"
                        )}{" "}
                        at
                        {format(
                          parseInt(MDS.util.getStateVariable(contract, 8)),
                          " hh:mm:ss a"
                        )}
                        {" ("}
                        {(() => {
                          const endDate = parseInt(
                            MDS.util.getStateVariable(contract, 8)
                          );
                          const now = new Date();

                          const daysDifference = differenceInDays(now, endDate);
                          if (daysDifference === 0) {
                            const hoursDifference = differenceInHours(
                              now,
                              endDate
                            );
                            if (hoursDifference === 0) {
                              const minutesDifference = differenceInMinutes(
                                now,
                                endDate
                              );
                              if (minutesDifference === 0) {
                                const secondsDifference = differenceInSeconds(
                                  now,
                                  endDate
                                );
                                return `${
                                  secondsDifference >= 0
                                    ? `${secondsDifference} seconds ago`
                                    : `in ${Math.abs(
                                        secondsDifference
                                      )} seconds`
                                }`;
                              }
                              return `${
                                minutesDifference >= 0
                                  ? `${minutesDifference} minutes ago`
                                  : `in ${Math.abs(minutesDifference)} minutes`
                              }`;
                            }
                            return `${
                              hoursDifference >= 0
                                ? `${hoursDifference} hours ago`
                                : `in ${Math.abs(hoursDifference)} hours`
                            }`;
                          }
                          return `${
                            daysDifference >= 0
                              ? `${daysDifference} days ago`
                              : `in ${Math.abs(daysDifference)} days`
                          }`;
                        })()}
                        {")"}
                      </p>
                    </li>
                    <li>
                      <h6>Grace period</h6>
                      <p>
                        {getKeyByValue(
                          gracePeriods,
                          parseInt(MDS.util.getStateVariable(contract, 7))
                        )?.replace(/[_]/g, " ")}
                      </p>
                    </li>
                    <li>
                      <h6>Grace period block time left</h6>
                      <p>{calculatedData.mustwaitblocks + " blocks"}</p>
                    </li>
                    <li>
                      <h6 className={styles["copy-label"]}>
                        Token ID
                        <button
                          type="button"
                          className={
                            copyButton.tokenid ? styles.activeCopy : ""
                          }
                          onClick={() =>
                            handleCopy(contract.tokenid, "tokenid")
                          }
                        >
                          Copy
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <mask
                              id="mask0_43_1192"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_43_1192)">
                              <path
                                d="M4.98262 22C4.42862 22 3.95968 21.8108 3.57581 21.4324C3.19194 21.054 3 20.5918 3 20.0457V6.32435H4.64514V20.0457C4.64514 20.1289 4.6803 20.2051 4.7506 20.2745C4.8209 20.3438 4.89824 20.3784 4.98262 20.3784H15.6129V22H4.98262ZM8.82133 18.2162C8.26731 18.2162 7.79836 18.027 7.41449 17.6487C7.03063 17.2703 6.83871 16.808 6.83871 16.262V3.95425C6.83871 3.40818 7.03063 2.94595 7.41449 2.56757C7.79836 2.18919 8.26731 2 8.82133 2H18.0174C18.5714 2 19.0403 2.18919 19.4242 2.56757C19.8081 2.94595 20 3.40818 20 3.95425V16.262C20 16.808 19.8081 17.2703 19.4242 17.6487C19.0403 18.027 18.5714 18.2162 18.0174 18.2162H8.82133ZM8.82133 16.5946H18.0174C18.1017 16.5946 18.1791 16.56 18.2494 16.4907C18.3197 16.4214 18.3549 16.3451 18.3549 16.262V3.95425C18.3549 3.87108 18.3197 3.79485 18.2494 3.72555C18.1791 3.65625 18.1017 3.6216 18.0174 3.6216H8.82133C8.73695 3.6216 8.65961 3.65625 8.58931 3.72555C8.51898 3.79485 8.48382 3.87108 8.48382 3.95425V16.262C8.48382 16.3451 8.51898 16.4214 8.58931 16.4907C8.65961 16.56 8.73695 16.5946 8.82133 16.5946Z"
                                fill="#91919D"
                              />
                            </g>
                          </svg>
                        </button>
                      </h6>
                      <input
                        readOnly
                        value={contract?.tokenid}
                        className="w-full bg-transparent focus:outline-none truncate"
                      />
                    </li>
                    <li>
                      <h6 className={styles["copy-label"]}>
                        Coin ID{" "}
                        <button
                          type="button"
                          className={copyButton.coinid ? styles.activeCopy : ""}
                          onClick={() => handleCopy(contract.coinid, "coinid")}
                        >
                          Copy
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <mask
                              id="mask0_43_1192"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_43_1192)">
                              <path
                                d="M4.98262 22C4.42862 22 3.95968 21.8108 3.57581 21.4324C3.19194 21.054 3 20.5918 3 20.0457V6.32435H4.64514V20.0457C4.64514 20.1289 4.6803 20.2051 4.7506 20.2745C4.8209 20.3438 4.89824 20.3784 4.98262 20.3784H15.6129V22H4.98262ZM8.82133 18.2162C8.26731 18.2162 7.79836 18.027 7.41449 17.6487C7.03063 17.2703 6.83871 16.808 6.83871 16.262V3.95425C6.83871 3.40818 7.03063 2.94595 7.41449 2.56757C7.79836 2.18919 8.26731 2 8.82133 2H18.0174C18.5714 2 19.0403 2.18919 19.4242 2.56757C19.8081 2.94595 20 3.40818 20 3.95425V16.262C20 16.808 19.8081 17.2703 19.4242 17.6487C19.0403 18.027 18.5714 18.2162 18.0174 18.2162H8.82133ZM8.82133 16.5946H18.0174C18.1017 16.5946 18.1791 16.56 18.2494 16.4907C18.3197 16.4214 18.3549 16.3451 18.3549 16.262V3.95425C18.3549 3.87108 18.3197 3.79485 18.2494 3.72555C18.1791 3.65625 18.1017 3.6216 18.0174 3.6216H8.82133C8.73695 3.6216 8.65961 3.65625 8.58931 3.72555C8.51898 3.79485 8.48382 3.87108 8.48382 3.95425V16.262C8.48382 16.3451 8.51898 16.4214 8.58931 16.4907C8.65961 16.56 8.73695 16.5946 8.82133 16.5946Z"
                                fill="#91919D"
                              />
                            </g>
                          </svg>
                        </button>
                      </h6>
                      <input
                        readOnly
                        value={contract.coinid}
                        className="w-full bg-transparent focus:outline-none truncate"
                      />
                    </li>
                    <li>
                      <h6 className={styles["copy-label"]}>
                        Withdrawal address
                        <button
                          type="button"
                          className={
                            copyButton.address ? styles.activeCopy : ""
                          }
                          onClick={() =>
                            handleCopy(
                              MDS.util.getStateVariable(contract, 0),
                              "address"
                            )
                          }
                        >
                          Copy
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <mask
                              id="mask0_43_1192"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_43_1192)">
                              <path
                                d="M4.98262 22C4.42862 22 3.95968 21.8108 3.57581 21.4324C3.19194 21.054 3 20.5918 3 20.0457V6.32435H4.64514V20.0457C4.64514 20.1289 4.6803 20.2051 4.7506 20.2745C4.8209 20.3438 4.89824 20.3784 4.98262 20.3784H15.6129V22H4.98262ZM8.82133 18.2162C8.26731 18.2162 7.79836 18.027 7.41449 17.6487C7.03063 17.2703 6.83871 16.808 6.83871 16.262V3.95425C6.83871 3.40818 7.03063 2.94595 7.41449 2.56757C7.79836 2.18919 8.26731 2 8.82133 2H18.0174C18.5714 2 19.0403 2.18919 19.4242 2.56757C19.8081 2.94595 20 3.40818 20 3.95425V16.262C20 16.808 19.8081 17.2703 19.4242 17.6487C19.0403 18.027 18.5714 18.2162 18.0174 18.2162H8.82133ZM8.82133 16.5946H18.0174C18.1017 16.5946 18.1791 16.56 18.2494 16.4907C18.3197 16.4214 18.3549 16.3451 18.3549 16.262V3.95425C18.3549 3.87108 18.3197 3.79485 18.2494 3.72555C18.1791 3.65625 18.1017 3.6216 18.0174 3.6216H8.82133C8.73695 3.6216 8.65961 3.65625 8.58931 3.72555C8.51898 3.79485 8.48382 3.87108 8.48382 3.95425V16.262C8.48382 16.3451 8.51898 16.4214 8.58931 16.4907C8.65961 16.56 8.73695 16.5946 8.82133 16.5946Z"
                                fill="#91919D"
                              />
                            </g>
                          </svg>
                        </button>
                      </h6>
                      <input
                        readOnly
                        value={MDS.util.getStateVariable(contract, 0)}
                        className="w-full bg-transparent focus:outline-none truncate"
                      />
                    </li>
                    <li>
                      {parseInt(tip) < parseInt(calculatedData.startblock) && (
                        <h6>Begins on Block</h6>
                      )}
                      {parseInt(tip) > parseInt(calculatedData.startblock) && (
                        <h6>Began on Block</h6>
                      )}
                      <p>{calculatedData.startblock}</p>
                    </li>
                    <li>
                      <h6>Expires on Block</h6>
                      <p>{calculatedData.finalblock}</p>
                    </li>
                  </ul>
                )}
              </section>
            )}
            {!calculatedData && (
              <div>
                <p className={styles["no-contracts"]}>
                  This section is unavailable, refresh and try again.
                </p>
              </div>
            )}
            <button
              onClick={handleCollectionPrompt}
              className="p-2 tracking-wide disabled:opacity-30 hover:bg-yellow-300 focus:outline-none bg-[#FFCD1E] text-[#1B1B1B] w-full flex items-center justify-center gap-2 font-bold py-2 rounded hover:bg-opacity-90"
              type="button"
              disabled={
                (error && error?.burn) ||
                calculatedData === null ||
                (calculatedData &&
                  (calculatedData.cancollect <= 0 ||
                    calculatedData.mustwait === "TRUE"))
              }
            >
              Collect
            </button>

            <div>
              {error && error.burn && (
                <p className="text-sm text-center text-yellow-500 mt-3">
                  {error.burn}
                </p>
              )}
            </div>
            <div className="my-2 w-full flex">
              <p className="text-sm my-auto text-black">
                Network
                <br /> fee
              </p>
              <div className="ml-auto">
                <span className="flex justify-end text-orange-500">
                  <FireIcon size={22} fill="currentColor" />
                </span>
                <input
                  id="burn"
                  name="burn"
                  value={burn}
                  onChange={handleChange}
                  placeholder="0.0"
                  className={`placeholder:font-mono placeholder:text-neutral-500 bg-transparent focus:outline-none text-right max-w-max text-sm ${
                    error && error.burn
                      ? "underline underline-offset-2 underline-red-500"
                      : ""
                  }`}
                />
              </div>
            </div>
          </section>
        </section>
      </AnimateFadeIn>

      <AnimateFadeIn display={!contract}>
        <div className="text-center">
          <p className="">This contract does not exist.</p>
          <p className="text-neutral-400">
            Your contract will not show once it has been completed/all
            collected.
          </p>
        </div>
      </AnimateFadeIn>
    </>
  );
};

export default ContractDetails;
