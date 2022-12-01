import * as React from "react";
import Image from "next/image";
import logo from "../../public/logo.svg";
import emoji from "../../public/emoji_thumbs_up.png";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Confetti from "react-confetti";
import useWindowSize from "./../../hooks/useWindowSize/useWindowSize";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import ERC20 from "../../abi/ERC20.abi.json";
import Wallet from "../../components/Wallet";
import Footer from "../../components/Footer";
import { utils } from "ethers";
import Header from "../../components/header";
import styles from "./woop.module.scss";
import cx from "classnames";
import wethLogo from "../../public/weth.png";
import daiLogo from "../../public/dai.png";
import usdcLogo from "../../public/usdc.png";

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
  const [badRequest, setBadRequest] = React.useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;
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
      //console.log(json);
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

  // wagmi transaction
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

  const coins = [
    {
      tokenId: "WETH",
      logo: wethLogo,
    },
    {
      tokenId: "DAI",
      logo: daiLogo,
    },
    {
      tokenId: "USDC",
      logo: usdcLogo,
    },
  ];

  const findIcon = (tokenName: string) => {
    const coin = coins.find((coin) => tokenName === coin.tokenId);
    console.log(coin);
    return (
      coin && (
        <Image
          alt={coin.tokenId}
          src={coin.logo}
          className="p-1"
          width={40}
          height={40}
        />
      )
    );
  };

  return (
    <div>
      <Header />

      <article
        className={cx(
          styles.baseContainer,
          "h-screen w-full flex justify-center items-center"
        )}>
        {/* NOTIFICATIONS */}
        <div className="fixed top-8 bg-white rounded">
          {(isPrepareError || isError) && (
            <Alert variant="filled" severity="error">
              Error: {(prepareError || error)?.message}
            </Alert>
          )}

          {badRequest && (
            <Alert variant="filled" severity="error">
              Error: Payment not found
            </Alert>
          )}

          {isSuccess && (
            <Alert variant="filled" severity="success">
              Payment successful! Track your tx on{" "}
              <a
                className="underline underline-offset-4"
                href={`https://goerli.etherscan.io/tx/${data?.hash}`}>
                Etherscan
              </a>
            </Alert>
          )}
        </div>

        <section
          className={cx(
            styles.containerBase,
            "h-screen w-full absolute top-0 z-0 flex opacity-50 items-center"
          )}></section>

        {/* CONTENT */}
        <Container maxWidth="xs" className="z-10">
          <Box
            component="form"
            className={cx(styles.containerBox, "rounded-3xl shadow-md w-full")}>
            <section className="justify-items-left font-base text-white">
              <div
                className={cx(
                  styles.topContainer,
                  "mb-2 pl-6 pr-4 pt-4 pb-3 w-full flex justify-between items-center"
                )}>
                <p className="font-base font-bold text-xl opacity-70">
                  {"You've received a Woop! "}{" "}
                </p>
                <p className="text-3xl ml-2 opacity-100">✨</p>
              </div>

              <div className="px-4 pb-4 pt-1">
                {badRequest ? (
                  <p className="mt-1 text-xl">Is the request url correct? 🤔</p>
                ) : (
                  <>
                    {/* <p className="mb-1 text-2xl">
                    </p> */}
                    <p className="text-xs text-slate-300 mb-2">
                      {request?.from.slice(0, 4)}...{request?.from.slice(-4)}
                      {" requested you:"}
                    </p>
                    <p className="mt-3 md:text-6xl text-5xl font-bold my-6 flex">
                      <>
                        {request && findIcon(request?.tokenName)}
                        {request?.value} {request?.tokenName}
                      </>
                    </p>
                  </>
                )}

                <div className="">
                  <button
                    className={cx(
                      "border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
                    )}
                    disabled={!write || isLoading}
                    onClick={() => write?.()}>
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-3 bg-sky-500"
                          viewBox="0 0 24 24"></svg>
                        <p>Processing...</p>
                      </>
                    ) : (
                      "Pay Woop"
                    )}
                  </button>
                </div>
              </div>
            </section>
          </Box>
        </Container>
      </article>

      {isSuccess && (
        <div className="flex justify-center m-7">
          <Image alt="web3-pay-success" src={emoji} width={350} height={350} />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Request;
