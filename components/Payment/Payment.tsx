import * as React from "react";
import { useState } from "react";
import Image from "next/image";

import { Share } from "../Share/Share";
import ErrorsUi from "../ErrorsUi/ErrorsUi";
import MenuItem from "@mui/material/MenuItem";
import styles from "./payment.module.scss";
import cx from "classnames";

import { useAccount, useNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { uploadIpfs } from "../../utils/ipfs";
import {
  selectToken,
  selectTokenDecimals,
  tokensDetails,
} from "../../utils/constants";
import { event } from "../../utils/ga";

export default function Payment(props: any) {
  const [selectedToken, setSelectedToken] = React.useState<{
    label: string;
    logo: any;
    decimals: number;
    homestead: string;
    goerli: string;
    optimism: string;
    arbitrum: string;
    matic: string;
  }>(tokensDetails[0]);
  const [amount, setAmount] = React.useState<string>("0");
  const [path, setPath] = React.useState<string>("");
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);
  const [chainId, setChainId] = React.useState<string>("");
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const { isConnected: connected, address } = useAccount();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();

  const [selectorVisibility, setSelectorVisibility] =
    React.useState<boolean>(false);
  const [isShareActive, setIsShareActive] = useState<boolean>(false);
  const [badRequest, setBadRequest] = useState<any>("");

  //event handlers
  const handleAmountChange = (event: any) => {
    setAmount(event.target.value as string);
  };

  //main functions
  const createRequest = async () => {
    setBadRequest("");

    if (amount == "0") {
      setBadRequest("You cannot create a WOOP with amount equal to zero");
    } else {
      try {
        setIpfsLoading(true);
        const data = {
          version: "1.0.0",
          from: address,
          value: amount,
          decimals: selectTokenDecimals(selectedToken.label),
          network: chain?.network,
          networkName: chain?.name,
          tokenName: selectedToken.label,
          tokenAddress: selectToken(selectedToken.label, chainId),
        };

        const { path } = await uploadIpfs(data).finally(() => {
          setIpfsLoading(false);
          event({
            action: "create_woop",
            category: selectedToken.label,
            label: chain ? chain?.name : "",
            value: amount,
          });
        });
        setPath(path);
        setIsShareActive(true);
      } catch (error) {
        console.error(error);
        setBadRequest("Oops! Something went wrong. Please try again later.");
        setIpfsLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (connected) {
      setIsConnected(true);
      event({
        action: "visit_woop_request",
        category: "",
        label: address ? address : "",
        value: "",
      });
    } else {
      setIsConnected(false);
    }
  }, [connected]);

  React.useEffect(() => {
    if (chain) {
      setSelectedToken(tokensDetails[0]);
      setChainId(chain.network);
      if (chain.network == "matic") {
        setSelectedToken(tokensDetails[1]);
      }
    }
  }, [chain]);

  return (
    <>
      {selectorVisibility && (
        <section className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-30">
          <div
            onClick={() => setSelectorVisibility(!selectorVisibility)}
            className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-30"
          ></div>
          <div className="z-20 bg-white rounded-xl shadow-xl py-2 px-2 md:w-80 w-full m-5">
            <p className="font-base font-semibold text-slate-700 pl-4 pb-3 pt-2 border-b mb-3">
              Select a token:
            </p>
            {tokensDetails
              .filter((token) => {
                if (chainId == "matic") {
                  if (token.label != "ETH") return token;
                } else {
                  if (token.label != "MATIC") return token;
                }
              })
              .map((token, i) => {
                return (
                  <MenuItem
                    key={token.label}
                    onClick={() => {
                      setSelectedToken(token);
                      setSelectorVisibility(!selectorVisibility);
                    }}
                    value={token.label}
                    sx={{
                      marginBottom: tokensDetails.length - 1 === i ? 0 : 1,
                    }}
                    className="cursor-pointer hover:bg-slate-200 rounded-xl p-1"
                  >
                    <div className="flex items-center">
                      <Image
                        alt={token.label}
                        src={token.logo}
                        className="p-1"
                        width={40}
                        height={40}
                      />
                      <span className="ml-3 text-slate-700 font-base font-semibold">
                        {token.label}
                      </span>
                    </div>
                  </MenuItem>
                );
              })}
          </div>
        </section>
      )}

      <div className="p-2 flex flex-col w-full relative">
        <div className="absolute left-2 -top-16 mb-2">
          <ErrorsUi errorMsg={badRequest} errorNtk={""} />
        </div>
        <p className="font-medium font-base text-sm text-white mb-2 pl-2">
          <span className="md:block hidden">Select the amount to request:</span>
          <span className="md:hidden">Requesting:</span>
        </p>

        <div className="relative">
          <input
            autoFocus={isConnected}
            className={cx(
              styles.mainInput,
              "border-white rounded-xl border font-medium text-3xl focus:outline-0 focus:white w-full h-16 mb-3 font-sans text-white bg-transparent pl-4"
            )}
            type="number"
            step="0.000000"
            placeholder="0.00"
            onChange={handleAmountChange}
          ></input>

          <button
            type="button"
            style={{
              width: 110,
              height: 38,
              position: "absolute",
              top: -20,
              right: 25,
            }}
            className="bg-white shadow-md rounded-xl text-slate-900 hover:shadow-xl hover:bg-white"
            onClick={() => setSelectorVisibility(!selectorVisibility)}
          >
            <div className="flex items-center w-full ml-1">
              <Image
                alt={selectedToken.label}
                src={selectedToken.logo}
                className="pr-1 ml-1"
                width={30}
                height={30}
              />
              <span className="ml-1 text-slate-700 font-base font-semibold">
                {selectedToken.label}
              </span>
            </div>
          </button>
        </div>
        <button
          type="button"
          className={cx(
            "flex justify-center items-center border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
          )}
          onClick={isConnected ? createRequest : openConnectModal}
        >
          {ipfsLoading ? (
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
          ) : isConnected ? (
            "Create a Woop"
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>

      {isShareActive && (
        <section className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-30">
          <div
            onClick={() => setIsShareActive(!isShareActive)}
            className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-30"
          ></div>
          <div
            className={cx(
              styles.shareBackground,
              "z-20 rounded-3xl shadow-xl py-2 px-2 md:w-96 w-full m-5"
            )}
          >
            <Share
              visibility={setIsShareActive}
              path={path}
              amount={amount}
              token={selectedToken}
            />
          </div>
        </section>
      )}
    </>
  );
}
