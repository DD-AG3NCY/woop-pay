import * as React from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Confetti from "react-confetti";
import useWindowSize from "./../../hooks/useWindowSize/useWindowSize";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  usePrepareSendTransaction,
  useSendTransaction,
  useAccount,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { setEtherscanBase, tokensDetails } from "../../utils/constants";

import ERC20 from "../../abi/ERC20.abi.json";
import Footer from "../../components/Footer";
import { utils } from "ethers";
import Header from "../../components/header";
import styles from "./woop.module.scss";
import cx from "classnames";
import Link from "next/link";
import ErrorsUi from "../../components/ErrorsUi/ErrorsUi";

interface Request {
  version: string;
  from: string;
  value: string;
  tokenName: string;
  tokenAddress: string;
}

const Request = () => {
  const [request, setRequest] = React.useState<Request>();
  const [amount, setAmount] = React.useState<string>("0.1");
  const [recipient, setRecipient] = React.useState<string>("");
  const [network, setNetwork] = React.useState<string>("");
  const [woopBadRequest, setWoopBadRequest] = React.useState<string>("");
  const [badRequest, setBadRequest] = React.useState<boolean>(false);
  const [isNativeTx, setIsNativeTx] = React.useState<boolean>(false);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;
  const { isConnected: connected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { width, height } = useWindowSize();

  // querying ipfs
  const callIpfs = async () => {
    try {
      const response = await fetch(
        `https://web3-pay.infura-ipfs.io/ipfs/${id}`
      );

      if (!response.ok) throw new Error(response.statusText);

      const json = await response.json();
      setRequest(json);
      setAmount(json.value);
      setRecipient(json.from);
      setNetwork(setEtherscanBase(json.network));

      if (json.tokenName == "ETH") {
        setIsNativeTx(true);
      }
    } catch (error) {
      console.error(error);
      setBadRequest(true);
    }
  };

  React.useEffect(() => {
    if (id) {
      callIpfs();
    }
  }, [id]);

  React.useEffect(() => {
    if (connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [connected]);

  // wagmi erc20 transaction
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: request?.tokenAddress,
    abi: ERC20,
    functionName: "transfer",
    args: [request?.from, utils.parseEther(amount)],
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  //wagmi native transaction
  const {
    config: configNative,
    error: prepareErrorNative,
    isError: isPrepareErrorNative,
  } = usePrepareSendTransaction({
    request: {
      to: recipient,
      value: amount ? utils.parseEther(amount) : undefined,
    },
  });
  const {
    data: dataNative,
    error: errorNative,
    isError: isErrorNative,
    sendTransaction,
  } = useSendTransaction(configNative);

  const { isLoading: isLoadingNative, isSuccess: isSuccessNative } =
    useWaitForTransaction({
      hash: dataNative?.hash,
    });

  React.useEffect(() => {
    if (!isConnected) {
      setWoopBadRequest("");
    } else {
      if (isNativeTx) {
        if (!sendTransaction && !badRequest) {
          setWoopBadRequest(
            "Payment not possible due to insufficient funds or contract error"
          );
        } else {
          setWoopBadRequest("");
        }
      } else {
        if (!write && !badRequest) {
          setWoopBadRequest(
            "Payment not possible due to insufficient funds or contract error"
          );
        } else {
          setWoopBadRequest("");
        }
      }
    }
  }, [isNativeTx, badRequest, isConnected, sendTransaction, write]);

  const colors = [
    "rgba(16, 130, 178, 1)",
    "rgba(79, 76, 227, 1)",
    "rgba(33, 35, 167, 0.5)",
    "rgb(6, 34, 92)",
  ];

  const findIcon = (tokenName: string) => {
    const coin = tokensDetails.find((token) => tokenName === token.label);
    return (
      coin && (
        <Image
          alt={coin.label}
          src={coin.logo}
          className=""
          width={20}
          height={20}
        />
      )
    );
  };

  return (
    <div>
      <Head>
        <title>woop-pay</title>
        <meta name="description" content="web3 payment requests made easy" />
        <link rel="icon" href="../icon.svg" />
      </Head>

      <Header />

      <article
        className={cx(
          styles.baseContainer,
          "h-screen w-full flex justify-center items-center"
        )}
      >
        <section
          className={cx(
            styles.containerBase,
            "h-screen w-full absolute top-0 z-0 flex opacity-50 items-center"
          )}
        ></section>

        {isSuccess ||
          (isSuccessNative && (
            <Confetti
              colors={colors}
              className="z-10"
              width={width}
              height={height}
            />
          ))}

        {/* CONTENT */}
        <Container maxWidth="xs" className="z-10">
          <div className={"mb-2"}>
            <ErrorsUi errorMsg={woopBadRequest} />
          </div>
          <Box
            component="form"
            className={cx(styles.containerBox, "rounded-3xl shadow-md w-full")}
          >
            <section className="justify-items-left font-base text-white">
              <div
                className={cx(
                  styles.topContainer,
                  "mb-2 pl-6 pr-4 pt-4 pb-3 w-full flex justify-between items-center"
                )}
              >
                <p className="font-base font-bold text-xl">
                  {badRequest
                    ? "No Woop to pay here"
                    : isNativeTx
                    ? isSuccessNative
                      ? "Woop sent!"
                      : "You've received a Woop! "
                    : isSuccess
                    ? "Woop sent!"
                    : "You've received a Woop! "}
                </p>
                <p className="text-3xl ml-2">
                  {badRequest
                    ? "⚠️"
                    : isSuccess
                    ? "💸"
                    : isSuccessNative
                    ? "💸"
                    : "✨"}
                </p>
              </div>
              {badRequest ? (
                <>
                  <div className="px-4 pb-4 pt-1">
                    <div className="mt-3 md:text-2xl text-xl text-center w-full font-bold my-6">
                      Check the link 🙏
                    </div>
                    <Link href="/">
                      <button
                        className={cx(
                          "border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
                        )}
                      >
                        Go back
                      </button>
                    </Link>
                  </div>
                </>
              ) : isSuccess ? (
                <>
                  <div className="px-4 pb-4 pt-1">
                    <div className="mt-3 text-center w-full my-6">
                      <p className="font-bold md:text-5xl text-4xl mb-2">
                        {request?.value} {request?.tokenName}
                      </p>
                      <p className="text-xs text-slate-300 mb-2">
                        {"Are on "}
                        <a
                          className="underline underline-offset-4"
                          href={`${network}/${data?.hash}`}
                        >
                          their way
                        </a>
                        {" to "}
                        {request?.from.slice(0, 4)}...{request?.from.slice(-4)}
                      </p>
                    </div>
                    <Link href="/">
                      <button
                        className={cx(
                          "border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
                        )}
                      >
                        Finish
                      </button>
                    </Link>
                  </div>
                </>
              ) : isSuccessNative ? (
                <>
                  <div className="px-4 pb-4 pt-1">
                    <div className="mt-3 text-center w-full my-6">
                      <p className="font-bold md:text-5xl text-4xl mb-2">
                        {request?.value} {request?.tokenName}
                      </p>
                      <p className="text-xs text-slate-300 mb-2">
                        {"Are on "}
                        <a
                          className="underline underline-offset-4"
                          href={`${network}/${dataNative?.hash}`}
                        >
                          their way
                        </a>
                        {" to "}
                        {request?.from.slice(0, 4)}...{request?.from.slice(-4)}
                      </p>
                    </div>
                    <Link href="/">
                      <button
                        className={cx(
                          "border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
                        )}
                      >
                        Finish
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="px-4 pb-4 pt-1 relative">
                  <>
                    {/* <p className="mb-1 text-2xl">
                    </p> */}
                    <div className="absolute top-0 right-3 p-1">
                      {request && findIcon(request?.tokenName)}
                    </div>
                    <p className="text-xs text-slate-300 mb-2">
                      {request?.from.slice(0, 4)}...{request?.from.slice(-4)}
                      {" requested you:"}
                    </p>
                    <div className="mt-3 md:text-6xl text-5xl font-bold my-6">
                      {request?.value} {request?.tokenName}
                    </div>
                  </>

                  <div className="">
                    <button
                      type="button"
                      className={cx(
                        "flex justify-center items-center border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
                      )}
                      disabled={
                        isConnected &&
                        (isNativeTx
                          ? !sendTransaction || isLoadingNative
                          : !write || isLoading)
                      }
                      onClick={
                        !isConnected
                          ? openConnectModal
                          : isNativeTx
                          ? () => sendTransaction?.()
                          : () => write?.()
                      }
                    >
                      {!isConnected ? (
                        "Connect Wallet"
                      ) : isNativeTx ? (
                        isLoadingNative ? (
                          <svg
                            className="animate-spin rounded-full w-5 h-5 mr-3 bg-white-500"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke-width="4"
                              stroke="currentColor"
                              stroke-dasharray="32"
                              stroke-linecap="round"
                              fill="transparent"
                            />
                          </svg>
                        ) : (
                          "Pay Woop"
                        )
                      ) : isLoading ? (
                        <>
                          <svg
                            className="animate-spin rounded-full w-5 h-5 mr-3 bg-white-500"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke-width="4"
                              stroke="currentColor"
                              stroke-dasharray="32"
                              stroke-linecap="round"
                              fill="transparent"
                            />
                          </svg>
                        </>
                      ) : (
                        "Pay Woop"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </Box>
        </Container>
      </article>

      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Request;
