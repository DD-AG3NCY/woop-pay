import * as React from "react";
import { Share } from "../Share";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";

import { useAccount, useConnect, useNetwork } from "wagmi";
import { uploadIpfs } from "../../utils/ipfs";
import { selectToken, tokensDetails } from "../../utils/constants";

import Image from "next/image";
import wethLogo from "../../public/eth.png";
import daiLogo from "../../public/dai.png";
import usdcLogo from "../../public/usdc.png";

import styles from "./payment.module.scss";
import cx from "classnames";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function Payment(props: any) {
  const { setBadRequest, setAmountZeroRequest, setNoTokenRequest } = props;
  const [tokenLabel, setTokenLabel] = React.useState("");
  const [selectedToken, setSelectedToken] = React.useState<{
    tokenId: string;
    logo: any;
  }>({
    tokenId: "DAI",
    logo: daiLogo,
  });
  const [amount, setAmount] = React.useState<string>("0");
  const [path, setPath] = React.useState<string>("");
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);
  const [chainId, setChainId] = React.useState<string>("");
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();

  const [selectorVisibility, setSelectorVisibility] =
    React.useState<boolean>(false);

  const { isConnected } = useAccount();
  useConnect();

  //event handlers
  const handleTokenLabelChange = (event: SelectChangeEvent) => {
    setTokenLabel(event.target.value as string);
  };

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value as string);
  };

  //main functions
  const createRequest = async () => {
    if (selectedToken === undefined) {
      return;
    }

    setAmountZeroRequest(false);
    setNoTokenRequest(false);
    setBadRequest(false);

    if (amount == "0") {
      setAmountZeroRequest(true);
    } else if (selectedToken && selectedToken.tokenId == "") {
      setNoTokenRequest(true);
    } else {
      try {
        setIpfsLoading(true);
        const { path } = await uploadIpfs({
          version: "1.0.0",
          // metadata_id: uuid(), can be used in the future to have a proper payment id
          from: address,
          value: amount,
          network: chain?.network,
          tokenName: tokenLabel,
          tokenAddress: selectToken(tokenLabel, chainId),
        }).finally(() => {
          setIpfsLoading(false);
        });
        setPath(path);
      } catch (error) {
        console.error(error);
        setBadRequest(true);
        setIpfsLoading(false);
      }
    }
  };

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

  React.useEffect(() => {
    setSelectedToken(coins[0]);
    return () => {};
  }, []);

  React.useEffect(() => {
    if (chain) {
      setChainId(chain.network);
    }
  }, [chain]);

  // to refactor the menu item part by using .map
  return (
    <>
      {selectorVisibility && (
        <section className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-30">
          <div
            onClick={() => setSelectorVisibility(!selectorVisibility)}
            className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-30"
          >
            {/* <div className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-10 z-10"></div>
        {/* <InputLabel>{selectedToken.tokenId ? "ERC20" : "Select"}</InputLabel> */}
          </div>
          <div className="z-20 bg-white rounded-xl shadow-xl py-2 px-2 md:w-2/5 w-full m-5">
            <p className="font-base font-semibold text-slate-700 pl-4 pb-3 pt-2 border-b mb-3">
              Select a token:
            </p>
            {coins.map((coin, i) => {
              return (
                <MenuItem
                  key={coin.tokenId}
                  onClick={() => {
                    setSelectedToken(coin);
                    setSelectorVisibility(!selectorVisibility);
                  }}
                  value={coin.tokenId}
                  sx={{
                    marginBottom: coins.length - 1 === i ? 0 : 1,
                  }}
                  className="cursor-pointer hover:bg-slate-200 rounded-xl p-1"
                >
                  <div className="flex items-center">
                    <Image
                      alt={coin.tokenId}
                      src={coin.logo}
                      className="p-1"
                      width={40}
                      height={40}
                    />
                    <span className="ml-3 text-slate-700 font-base font-semibold">
                      {coin.tokenId}
                    </span>
                  </div>
                </MenuItem>
              );
            })}
          </div>
        </section>
      )}

      <div className="p-2 flex flex-col w-full">
        <p className="font-medium font-base text-sm text-white mb-2 pl-2">
          <span className="md:block hidden">Select the amount to receive:</span>
          <span className="md:hidden">Receiving:</span>
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

          <Button
            sx={{
              width: 120,
              position: "absolute",
              top: -23,
              right: 25,
            }}
            className="bg-white shadow-md rounded-xl text-slate-900 hover:shadow-xl hover:bg-white"
            onClick={() => setSelectorVisibility(!selectorVisibility)}
          >
            <div className="flex items-center w-full ml-1">
              <Image
                alt={selectedToken.tokenId}
                src={selectedToken.logo}
                className="pr-1"
                width={30}
                height={30}
              />
              <span className="ml-1 text-slate-700 font-base font-semibold">
                {selectedToken.tokenId}
              </span>
            </div>
          </Button>
        </div>
        <button
          className={cx(
            "border-white border font-base text-lg focus:outline-0 focus:text-slate-700 w-full h-16 rounded-xl transition-all font-bold text-white capitalize hover:border-white hover:bg-white hover:text-slate-700"
          )}
          onClick={isConnected ? createRequest : openConnectModal}
        >
          {ipfsLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 bg-sky-500"
                viewBox="0 0 24 24"
              ></svg>
              <p>Processing...</p>
            </>
          ) : isConnected ? (
            "Create a Woop"
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>
      <div className="flex justify-center">
        <Share
          path={path}
          amount={amount}
          tokenLabel={selectedToken?.tokenId}
        />
      </div>
    </>
  );
}
