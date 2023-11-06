import { useContext, useEffect, useState } from "react";

import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { Coin } from "../../@types";
import styles from "./ContractDetails.module.css";
import Decimal from "decimal.js";

import useContractCalculation from "../../hooks/useContractCalculation";

import { gracePeriods } from "../../components/gracePeriod";
import { copy } from "../../utils/utils";

import * as RPC from "../../minima/libs/RPC";
import Dialog from "../../components/dialog";

import Loading from "../../assets/loading.json";
import Lottie from "lottie-react";
import { appContext } from "../../AppContext";
import FadeIn from "../../components/UI/Animations/FadeIn";

export function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

const ContractDetails = () => {
  const navigate = useNavigate();
  const { scriptAddress } = useContext(appContext);
  const [seeDetails, setDetails] = useState(false);
  const [contract, setContract] = useState<Coin | null>(null);
  const { contracts, tip } = useContext(appContext);
  const [copyButton, setCopy] = useState({
    tokenid: false,
    coinid: false,
    address: false,
  });

  const [prompt, setPrompt] = useState(false);
  const [progress, setProgress] = useState(false);
  const [success, setSuccess] = useState(false);
  const [finish, setFinished] = useState(false);
  const [error, setError] = useState<false | string>(false);

  const params = useParams();

  const calculatedData: any = useContractCalculation(contract);
  useEffect(() => {
    setContract(contracts.get(params.id));
  }, [contracts]);

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
  const handleCollect = async (coin: Coin) => {
    setPrompt(false);
    setProgress(true);

    try {
      await RPC.withdrawVestingContract(
        coin,
        calculatedData.cancollect,
        calculatedData.change,
        scriptAddress
      ).catch((err) => {
        throw new Error(err);
      });
      setProgress(false);
      setSuccess(true);

      // has the contract been fully collected ?
      const contractFinished = !contracts.get(params.id);

      if (contractFinished) {
        setFinished(true);
      }
    } catch (error: any) {
      setProgress(false);
      setError(error.message);
    }
  };

  return (
    <>
      {contract && (
        <FadeIn delay={0}>
          {!!prompt && (
            <FadeIn delay={0}>
              <Dialog
                title="Available to collect"
                subtitle={
                  <p className={styles["can-collect"]}>
                    {calculatedData && calculatedData.cancollect > 0
                      ? calculatedData.cancollect
                      : "N/A"}
                  </p>
                }
                buttonTitle="Collect"
                dismiss={true}
                primaryButtonAction={() => handleCollect(contract)}
                cancelAction={() => setPrompt(false)}
              />
            </FadeIn>
          )}

          {!!progress && (
            <FadeIn delay={0}>
              <Dialog
                title="Transaction in progress"
                subtitle={
                  <Lottie
                    style={{ width: 110, height: 110 }}
                    animationData={Loading}
                  />
                }
                buttonTitle="Back to contracts"
                dismiss={false}
                primaryButtonAction={() => navigate("/dashboard/creator")}
                primaryButtonDisable={true}
              />
            </FadeIn>
          )}

          {!!finish && (
            <FadeIn delay={0}>
              <Dialog
                title="Contract completed"
                subtitle={<img alt="success" src="./assets/check_circle.svg" />}
                buttonTitle="Back to contracts"
                dismiss={false}
                primaryButtonAction={() => navigate(-1)}
              />
            </FadeIn>
          )}

          {!!success && (
            <FadeIn delay={0}>
              <Dialog
                title="Transaction complete"
                subtitle={
                  <>
                    <p>Once confirmed on chain, your wallet will be updated.</p>
                    <img alt="success" src="./assets/check_circle.svg" />
                  </>
                }
                buttonTitle="Back to contract"
                dismiss={false}
                primaryButtonAction={() => setSuccess(false)}
              />
            </FadeIn>
          )}

          {Boolean(error) && (
            <FadeIn delay={0}>
              <Dialog
                title="Transaction failed"
                subtitle={<p>{error}</p>}
                buttonTitle="Back to contract"
                dismiss={false}
                primaryButtonAction={() => setError(false)}
              />
            </FadeIn>
          )}

          <section className={`${styles.grid}`}>
            <section>
              <button
                className={styles["back-btn"]}
                type="button"
                onClick={() => navigate(-1)}
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_33_7292"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="16"
                    height="17"
                  >
                    <rect y="0.5" width="16" height="16" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_33_7292)">
                    <path
                      d="M6.39969 14.6695L0.230469 8.50027L6.39969 2.33105L7.29582 3.22719L2.02275 8.50027L7.29582 13.7734L6.39969 14.6695Z"
                      fill="#08090B"
                    />
                  </g>
                </svg>
                Back
              </button>
              <section>
                <h6>Contract details</h6>
                <ul>
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
                    {contract.tokenid === "0x00" && <p>{contract.amount}</p>}
                    {contract.tokenid !== "0x00" && contract.tokenamount && (
                      <p>{contract.tokenamount}</p>
                    )}
                  </li>
                  <li>
                    <h6>Contract ID</h6>
                    <p>{MDS.util.getStateVariable(contract, 199)}</p>
                  </li>
                  <li>
                    <h6>Token name</h6>
                    {contract.tokenid === "0x00" && <p>Minima</p>}
                    {contract.tokenid !== "0x00" && (
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
                        {!contract && <p>N/A</p>}
                        {contract.tokenid === "0x00" && (
                          <p>
                            {new Decimal(MDS.util.getStateVariable(contract, 1))
                              .minus(contract.amount)
                              .toString()}
                          </p>
                        )}
                        {contract.tokenid !== "0x00" &&
                          contract.tokenamount && (
                            <p>
                              {new Decimal(
                                MDS.util.getStateVariable(contract, 1)
                              )
                                .minus(contract.tokenamount)
                                .toString()}
                            </p>
                          )}
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
                        <h6>Contract starts</h6>
                        <p>
                          {format(
                            parseInt(MDS.util.getStateVariable(contract, 6)),
                            "dd MMMM yyyy "
                          )}
                          at
                          {format(
                            parseInt(MDS.util.getStateVariable(contract, 6)),
                            " hh:mm:ss a"
                          )}
                        </p>
                      </li>
                      <li>
                        <h6>Contracts ends</h6>
                        <p>
                          {format(
                            parseInt(MDS.util.getStateVariable(contract, 8)),
                            "dd MMMM yyyy "
                          )}
                          at
                          {format(
                            parseInt(MDS.util.getStateVariable(contract, 8)),
                            " hh:mm:ss a"
                          )}
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
                        <p>{contract.tokenid}</p>
                      </li>
                      <li>
                        <h6 className={styles["copy-label"]}>
                          Coin ID{" "}
                          <button
                            type="button"
                            className={
                              copyButton.coinid ? styles.activeCopy : ""
                            }
                            onClick={() =>
                              handleCopy(contract.coinid, "coinid")
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
                        <p>{contract.coinid}</p>
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
                        <p>{MDS.util.getStateVariable(contract, 0)}</p>
                      </li>
                      <li>
                        {parseInt(tip) <
                          parseInt(calculatedData.startblock) && (
                          <h6>Begins on Block</h6>
                        )}
                        {parseInt(tip) >
                          parseInt(calculatedData.startblock) && (
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
                className={styles["collect-btn"]}
                type="button"
                disabled={
                  calculatedData === null ||
                  (calculatedData &&
                    (calculatedData.cancollect <= 0 ||
                      calculatedData.mustwait === "TRUE"))
                }
              >
                Collect
              </button>
            </section>
          </section>
        </FadeIn>
      )}
      {!contract && (
        <div>
          <p className={styles["no-contracts"]}>
            This contract does not exist. Your contract will not show once it
            has been completed/all collected.
          </p>
        </div>
      )}
    </>
  );
};

export default ContractDetails;
