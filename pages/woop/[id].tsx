import * as React from "react";
import Image from "next/image";
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
  useNetwork,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  setEtherscanBase,
  setEtherscanAddress,
  tokensDetails,
} from "../../utils/constants";
import { event } from "../../utils/ga";

import ERC20 from "../../abi/ERC20.abi.json";
import Footer from "../../components/Footer";
import { utils } from "ethers";
import Header from "../../components/Heading";
import styles from "./woop.module.scss";
import cx from "classnames";
import Link from "next/link";
import ErrorsUi from "../../components/ErrorsUi/ErrorsUi";
import SEO from "../../components/Seo";

interface Request {
  version: string;
  from: string;
  value: string;
  decimals: number;
  tokenName: string;
  tokenAddress: string;
}

const Request = () => {
  const [request, setRequest] = React.useState<Request>();
  const [amount, setAmount] = React.useState<string>("0.1");
  const [recipient, setRecipient] = React.useState<string>("");
  const [network, setNetwork] = React.useState<string>("");
  const [networkName, setNetworkName] = React.useState<string>("");
  const [woopBadRequest, setWoopBadRequest] = React.useState<string>("");
  const [woopBadNetwork, setWoopBadNetwork] = React.useState<string>("");
  const [badRequest, setBadRequest] = React.useState<boolean>(false);
  const [wrongNetwork, setWrongNetwork] = React.useState<boolean>(false);
  const [isNativeTx, setIsNativeTx] = React.useState<boolean>(false);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;
  const { isConnected: connected, address } = useAccount();
  const { chain } = useNetwork();
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
      setRecipient(json.from);
      setNetwork(json.network);
      setNetworkName(json.networkName);

      if (json.decimals != 18) {
        const amount: string = (
          Number(json.value) / Number(10 ** (18 - json.decimals))
        ).toFixed(18);
        setAmount(amount);
      } else {
        setAmount(json.value);
      }

      let tokenName: string = json.tokenName;
      if (tokenName == "ETH" || tokenName == "MATIC") {
        setIsNativeTx(true);
      }
      event({
        action: "visit_woop_payment",
        category: json.networkName,
        label: address ? address : "",
        value: `${json.value} ${json.tokenName}`,
      });
    } catch (error) {
      console.error(error);
      setBadRequest(true);
    }
  };

  const callIpfsForNetwork: any = async () => {
    try {
      const response = await fetch(
        `https://web3-pay.infura-ipfs.io/ipfs/${id}`
      );

      if (!response.ok) throw new Error(response.statusText);

      const json = await response.json();
      const result = {
        network: json.network,
        networkName: json.networkName,
      };
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const checkAndUpdateNetwork = (result: any) => {
    if (result?.network != chain?.network) {
      setWrongNetwork(true);
      setWoopBadNetwork(
        `Wrong network. Please connect to ${result?.networkName}`
      );
    } else {
      setWrongNetwork(false);
      setWoopBadNetwork("");
    }
    setNetwork(result?.network);
  };

  // wagmi erc20 transaction
  const { config } = usePrepareContractWrite({
    address: request?.tokenAddress,
    abi: ERC20,
    functionName: "transfer",
    args: [request?.from, utils.parseEther(amount)],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  //wagmi native transaction
  const { config: configNative } = usePrepareSendTransaction({
    request: {
      to: recipient,
      value: amount ? utils.parseEther(amount) : undefined,
    },
  });
  const { data: dataNative, sendTransaction } =
    useSendTransaction(configNative);

  const { isLoading: isLoadingNative, isSuccess: isSuccessNative } =
    useWaitForTransaction({
      hash: dataNative?.hash,
    });

  // react use effects
  React.useEffect(() => {
    if (!isConnected) {
      setWoopBadRequest("");
      setWoopBadNetwork("");
    } else {
      if (isNativeTx) {
        if (!sendTransaction && !badRequest) {
          setWoopBadRequest(
            `Payment not possible due to insufficient ${request?.tokenName} balance`
          );
        } else {
          setWoopBadRequest("");
        }
      } else {
        if (!write && !badRequest) {
          setWoopBadRequest(
            `Payment not possible due to insufficient ${request?.tokenName} balance`
          );
        } else {
          setWoopBadRequest("");
        }
      }
    }
  }, [isNativeTx, badRequest, isConnected, sendTransaction, write]);

  React.useEffect(() => {
    if (id) {
      callIpfs();
      callIpfsForNetwork().then((result: any) => checkAndUpdateNetwork(result));
    }
  }, [chain, id]);

  React.useEffect(() => {
    if (connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [connected]);

  React.useEffect(() => {
    if (isSuccess || isSuccessNative) {
      event({
        action: "paid_woop",
        category: networkName,
        label: address ? address : "",
        value: `${amount} ${request?.tokenName}`,
      });
    }
  }, [isSuccess, isSuccessNative]);

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
      <SEO
        title={"Woop Pay | Payment Request"}
        rrssImg="./RRSS.png"
        description={"You've been requested to send a payment through Woop Pay"}
      />

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

        {isSuccess ? (
          <Confetti
            colors={colors}
            className="z-10"
            width={width}
            height={height}
          />
        ) : isSuccessNative ? (
          <Confetti
            colors={colors}
            className="z-10"
            width={width}
            height={height}
          />
        ) : null}

        {/* CONTENT */}
        <Container maxWidth="xs" className="z-10">
          {!badRequest ? (
            <div className={"mb-2"}>
              <ErrorsUi errorMsg={woopBadRequest} errorNtk={woopBadNetwork} />
            </div>
          ) : (
            <></>
          )}

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
                    <div className="mt-6"></div>
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
              ) : !isConnected ? (
                <div className="px-4 pb-4 pt-1 relative">
                  <>
                    <div className="absolute top-0 right-3 p-1">
                      {request && findIcon(request?.tokenName)}
                    </div>
                    <p className="text-xs text-slate-300 mb-2">
                      <a
                        className="underline underline-offset-4"
                        href={`${setEtherscanAddress(network, request?.from)}`}
                      >
                        {request?.from.slice(0, 4)}...{request?.from.slice(-4)}
                      </a>
                      {" requested:"}
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
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </button>
                  </div>
                </div>
              ) : isSuccess ? (
                <>
                  <div className="px-4 pb-4 pt-1">
                    <div className="mt-3 text-center w-full my-6">
                      <p className="font-bold md:text-5xl text-4xl mb-2">
                        {request?.value} {request?.tokenName}
                      </p>
                      <p className="text-xs text-slate-300 mb-2">
                        <a
                          className="underline underline-offset-4"
                          href={`${setEtherscanBase(network, data?.hash)}`}
                        >
                          sent
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
                        <a
                          className="underline underline-offset-4"
                          href={`${setEtherscanBase(
                            network,
                            dataNative?.hash
                          )}`}
                        >
                          sent
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
                    <div className="absolute top-0 right-3 p-1">
                      {request && findIcon(request?.tokenName)}
                    </div>
                    <p className="text-xs text-slate-300 mb-2">
                      <a
                        className="underline underline-offset-4"
                        href={`${setEtherscanAddress(network, request?.from)}`}
                      >
                        {request?.from.slice(0, 4)}...{request?.from.slice(-4)}
                      </a>
                      {" requested:"}
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
                        (isNativeTx
                          ? !sendTransaction || isLoadingNative
                          : !write || isLoading) || wrongNetwork
                      }
                      onClick={
                        isNativeTx ? () => sendTransaction?.() : () => write?.()
                      }
                    >
                      {isNativeTx ? (
                        isLoadingNative ? (
                          <svg
                            className="animate-spin rounded-full w-5 h-5 mr-3 bg-white-500"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              strokeWidth="4"
                              stroke="currentColor"
                              strokeDasharray="32"
                              strokeLinecap="round"
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
                              strokeWidth="4"
                              stroke="currentColor"
                              strokeDasharray="32"
                              strokeLinecap="round"
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
