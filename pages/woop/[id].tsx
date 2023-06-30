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
import { sendNotification } from "../../utils/push";
import mixpanel from "mixpanel-browser";
import { getEnsName } from "../../utils/ens";

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
  const [amount, setAmount] = React.useState<string>("0.001");
  const [recipient, setRecipient] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [ensName, setEnsName] = React.useState<string>("");
  const [network, setNetwork] = React.useState<string>("");
  const [networkName, setNetworkName] = React.useState<string>("");
  const [allowPayerSelectAmount, setAllowPayerSelectAmount] =
    React.useState<boolean>(false);
  const [woopBadRequest, setWoopBadRequest] = React.useState<string>("");
  const [woopBadNetwork, setWoopBadNetwork] = React.useState<string>("");
  const [gif, setGif] = React.useState("");
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
  const MIXPANEL_ID = process.env.NEXT_PUBLIC_MIXPANEL_ID;

  // initiate tracking activity
  if (MIXPANEL_ID) {
    mixpanel.init(MIXPANEL_ID);
  }

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
      setDescription(json.description);

      if (json.value == "allowPayerSelectAmount") {
        setAllowPayerSelectAmount(true);
        const amount: string = (
          Number("0.001") / Number(10 ** (18 - json.decimals))
        ).toFixed(18);
        setAmount(amount);
      } else {
        if (json.decimals != 18) {
          const amount: string = (
            Number(json.value) / Number(10 ** (18 - json.decimals))
          ).toFixed(18);
          setAmount(amount);
        } else {
          setAmount(json.value);
        }
      }

      let tokenName: string = json.tokenName;
      if (tokenName == "ETH" || tokenName == "MATIC") {
        setIsNativeTx(true);
      }

      const recipient = await getEnsName(
        //"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        json.from
      );
      if (recipient) {
        setEnsName(recipient);
      }
      mixpanel.track("visit_woop_payment", {
        Token: json.tokenName,
        Network: json.networkName,
        Amount: json.value,
        Address: address,
        Link: id,
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

  const handleAmountChange = (event: any) => {
    const inputValue = event.target.value;

    if (inputValue === "") {
      if (request?.decimals != 18 && request) {
        const amount: string = (
          Number("0.001") / Number(10 ** (18 - request?.decimals))
        ).toFixed(18);
        setAmount(amount);
        return;
      } else {
        setAmount("0.001");
        return;
      }
    }

    if (request?.decimals != 18 && request) {
      const amount: string = (
        Number(inputValue) / Number(10 ** (18 - request?.decimals))
      ).toFixed(18);
      setAmount(amount);
    } else {
      setAmount(inputValue as string);
    }
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
          setWoopBadRequest(`Insufficient ${request?.tokenName} balance`);
        } else {
          setWoopBadRequest("");
        }
      } else {
        if (!write && !badRequest) {
          setWoopBadRequest(`Insufficient ${request?.tokenName} balance`);
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
    if (isSuccess) {
      if (request) {
        const etherscanLink = setEtherscanBase(network, data?.hash);
        sendNotification(
          recipient,
          address,
          networkName,
          amount,
          description,
          request,
          etherscanLink,
          id
        );
        mixpanel.track("paid_woop", {
          Token: request?.tokenName,
          Network: networkName,
          Amount: amount,
          Address: address,
          Link: id,
        });
      }
    }
    if (isSuccessNative) {
      if (request) {
        const etherscanLink = setEtherscanBase(network, dataNative?.hash);
        sendNotification(
          recipient,
          address,
          networkName,
          amount,
          description,
          request,
          etherscanLink,
          id
        );
        mixpanel.track("paid_woop", {
          Token: request?.tokenName,
          Network: networkName,
          Amount: amount,
          Address: address,
          Link: id,
        });
      }
    }
  }, [isSuccess, isSuccessNative]);

  React.useEffect(() => {
    randomGif();
  }, []);

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

  const gifs = [
    "https://media.giphy.com/media/l3q2wJsC23ikJg9xe/giphy.gif",
    "https://media.giphy.com/media/TpegB7FzEXfnWlrorG/giphy.gif",
    "https://media.giphy.com/media/8BHjXpkB7GfqJUbAxa/giphy.gif",
    "https://media.giphy.com/media/opfF5TLS75Oms/giphy.gif",
    "https://media.giphy.com/media/Tw4z4MD34y11K/giphy.gif",
  ];

  const randomGif = () => {
    setGif(gifs[Math.floor(Math.random() * gifs.length)]);
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

        {isSuccess || isSuccessNative ? (
          <Confetti
            colors={colors}
            className="z-10"
            width={width}
            height={height}
          />
        ) : null}

        {/* CONTENT */}
        <Container maxWidth="xs" className="">
          {!badRequest ? (
            <div className={"mb-2 z-20"}>
              <ErrorsUi errorMsg={woopBadRequest} errorNtk={woopBadNetwork} />
            </div>
          ) : (
            <></>
          )}

          <Box
            component="form"
            className={cx(
              styles.containerBox,
              "rounded-3xl shadow-md w-full relative z-20"
            )}
          >
            <section className="justify-items-left font-base text-white">
              <div
                className={cx(
                  styles.topContainer,
                  "mb-2 pl-4 pr-4 pt-4 pb-3 w-full flex justify-between items-center"
                )}
              >
                <p className="font-base font-bold text-xl">
                  {badRequest
                    ? "No Woop to pay here"
                    : isNativeTx
                    ? isSuccessNative
                      ? "Woop sent!"
                      : description
                      ? `${
                          description.charAt(0).toUpperCase() +
                          description.slice(1)
                        }`
                      : "Payment requested!"
                    : isSuccess
                    ? "Woop sent!"
                    : description
                    ? `${
                        description.charAt(0).toUpperCase() +
                        description.slice(1)
                      }`
                    : "Payment requested!"}
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
                    <p className="text-xs text-slate-300 mb-2 flex items-center">
                      <a
                        className="underline underline-offset-4"
                        href={`${setEtherscanAddress(network, request?.from)}`}
                      >
                        {ensName ? (
                          <p className="flex items-center">
                            <span className="mr-1 font-bold">{ensName}</span>
                            {/* <Image
                              alt="ens"
                              src={ens}
                              className=""
                              width={20}
                              height={20}
                            /> */}
                          </p>
                        ) : (
                          <span className="font-bold">
                            {request?.from.slice(0, 4)}...
                            {request?.from.slice(-4)}
                          </span>
                        )}
                      </a>
                      <span className="ml-1">{"requested:"}</span>
                    </p>
                    <div className="mt-3 md:text-6xl text-5xl font-bold my-6">
                      {request?.value == "allowPayerSelectAmount"
                        ? "..."
                        : request?.value}{" "}
                      {request?.tokenName}
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
                        {request?.decimals == 18
                          ? amount
                          : Number(amount) * 10 ** 12}{" "}
                        {request?.tokenName}
                      </p>
                      <p className="text-xs text-slate-300 mb-2 text-center">
                        <a
                          className="underline underline-offset-4 mr-1"
                          href={`${setEtherscanBase(
                            network,
                            dataNative?.hash
                          )}`}
                        >
                          sent
                        </a>
                        <span className="mr-1">{"to"}</span>
                        {ensName ? (
                          <a>
                            <span className="mr-1 font-bold">{ensName}</span>
                          </a>
                        ) : (
                          <span className="font-bold">
                            {request?.from.slice(0, 4)}...
                            {request?.from.slice(-4)}
                          </span>
                        )}
                      </p>
                      <div className="m-3">
                        <img src={gif} alt="Thank you" />
                      </div>
                    </div>
                    <Link href="/">
                      <button
                        className={cx(
                          "border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
                        )}
                      >
                        Close
                      </button>
                    </Link>
                  </div>
                </>
              ) : isSuccessNative ? (
                <>
                  <div className="px-4 pb-4 pt-1">
                    <div className="mt-3 text-center w-full my-6">
                      <p className="font-bold md:text-5xl text-4xl mb-2">
                        {amount} {request?.tokenName}
                      </p>
                      <p className="text-xs text-slate-300 mb-2 text-center">
                        <a
                          className="underline underline-offset-4 mr-1"
                          href={`${setEtherscanBase(
                            network,
                            dataNative?.hash
                          )}`}
                        >
                          sent
                        </a>
                        <span className="mr-1">{"to"}</span>
                        {ensName ? (
                          <a>
                            <span className="mr-1 font-bold">{ensName}</span>
                            {/* <Image
                              alt="ens"
                              src={ens}
                              className=""
                              width={20}
                              height={20}
                            /> */}
                          </a>
                        ) : (
                          <span className="font-bold">
                            {request?.from.slice(0, 4)}...
                            {request?.from.slice(-4)}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="m-3">
                      <img src={gif} alt="Thank you" />
                    </div>
                    <Link href="/">
                      <button
                        className={cx(
                          "border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
                        )}
                      >
                        Close
                      </button>
                    </Link>
                  </div>
                </>
              ) : allowPayerSelectAmount ? (
                <div className="px-4 pb-4 pt-1 relative">
                  <>
                    <div className="absolute top-0 right-3 p-1">
                      {request && findIcon(request?.tokenName)}
                    </div>
                    <div className="text-xs text-slate-300 mb-2 flex items-center">
                      <a
                        className="underline underline-offset-4"
                        href={`${setEtherscanAddress(network, request?.from)}`}
                      >
                        {ensName ? (
                          <p className="flex items-center">
                            <span className="font-bold">{ensName}</span>
                            {/* <Image
                              alt="ens"
                              src={ens}
                              className=""
                              width={20}
                              height={20}
                            /> */}
                          </p>
                        ) : (
                          <span className="font-bold">
                            {request?.from.slice(0, 4)}...
                            {request?.from.slice(-4)}
                          </span>
                        )}
                      </a>
                      <span className="ml-1">
                        {"requested to set an amount:"}
                      </span>
                    </div>
                    <div className="mt-3 md:text-6xl text-5xl font-bold my-6 text-center items-center">
                      <input
                        className="bg-transparent text-white text-center focus:outline-none mr-1"
                        type="number"
                        placeholder="0.001"
                        onChange={handleAmountChange}
                        style={{ maxWidth: "100%" }}
                      />
                      <div className="flex-shrink-0">{request?.tokenName}</div>
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
              ) : (
                <div className="px-4 pb-4 pt-1 relative">
                  <>
                    <div className="absolute top-0 right-3 p-1">
                      {request && findIcon(request?.tokenName)}
                    </div>
                    <p className="text-xs text-slate-300 mb-2 flex items-center">
                      <a
                        className="underline underline-offset-4"
                        href={`${setEtherscanAddress(network, request?.from)}`}
                      >
                        {ensName ? (
                          <p className="flex items-center">
                            <span className="font-bold">{ensName}</span>
                            {/* <Image
                              alt="ens"
                              src={ens}
                              className=""
                              width={20}
                              height={20}
                            /> */}
                          </p>
                        ) : (
                          <span className="font-bold">
                            {request?.from.slice(0, 4)}...
                            {request?.from.slice(-4)}
                          </span>
                        )}
                      </a>
                      <span className="ml-1">{"requested:"}</span>
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
