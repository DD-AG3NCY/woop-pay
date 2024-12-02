import * as React from "react";
import { useState } from "react";
import Image from 'next/image';
import { Share } from '../Share/Share';
import ErrorsUi from '../ErrorsUi/ErrorsUi';
import MenuItem from '@mui/material/MenuItem';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { uploadIpfs } from '../../utils/ipfs';
import {
  selectToken,
  selectTokenDecimals,
  tokensDetails,
  MAX_CHARACTER_LIMIT,
} from '../../utils/constants';
import mixpanel from 'mixpanel-browser';
import { sendNotificationRequest } from '../../utils/push';

export default function Payment(props: any) {
  const [selectedToken, setSelectedToken] = React.useState(tokensDetails[0]);
  const [amount, setAmount] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [characterCount, setCharacterCount] = useState(MAX_CHARACTER_LIMIT);
  const [path, setPath] = React.useState<string>('');
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);
  const [chainId, setChainId] = React.useState<string>('');
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const { isConnected: connected, address, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [selectorVisibility, setSelectorVisibility] =
    React.useState<boolean>(false);
  const [isShareActive, setIsShareActive] = useState<boolean>(false);
  const [badRequest, setBadRequest] = useState<any>('');
  const [allowPayerSelectAmount, setAllowPayerSelectAmount] =
    React.useState<boolean>(false);
  const MIXPANEL_ID = process.env.NEXT_PUBLIC_MIXPANEL_ID;

  if (MIXPANEL_ID) {
    mixpanel.init(MIXPANEL_ID);
  }

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value as string);
  };

  const handleDescriptionChange = (event: any) => {
    const inputDescription = event.target.value as string;
    if (inputDescription.length <= MAX_CHARACTER_LIMIT) {
      setDescription(inputDescription);
      setCharacterCount(MAX_CHARACTER_LIMIT - inputDescription.length);
    }
  };

  const createRequest = async () => {
    setBadRequest('');
    if (!amount || amount === '0') {
      setBadRequest('The requested amount must be higher than zero');
    } else {
      try {
        setIpfsLoading(true);
        const data = {
          version: '1.0.0',
          from: address,
          value: amount,
          description,
          decimals: selectTokenDecimals(selectedToken.label),
          network: chain?.id,
          networkName: chain?.name,
          tokenName: selectedToken.label,
          tokenAddress: selectToken(selectedToken.label, chainId),
        };
        const path = await uploadIpfs(data).finally(() =>
          setIpfsLoading(false)
        );
        mixpanel.track('create_woop', {
          Token: selectedToken.label,
          Network: chain?.name || '',
          Amount: amount,
          Address: address,
          Link: path,
        });
        sendNotificationRequest(
          address,
          chain?.name,
          amount,
          description,
          selectedToken.label,
          path
        );
        setPath(path);
        setIsShareActive(true);
      } catch (error) {
        console.error(error);
        setBadRequest('Oops! Something went wrong. Please try again later.');
        setIpfsLoading(false);
      }
    }
  };

  React.useEffect(() => {
    setIsConnected(connected);
    if (connected) {
      mixpanel.track('visit_woop_create_request', { Address: address });
    }
  }, [connected]);

  React.useEffect(() => {
    if (allowPayerSelectAmount) {
      setAmount('allowPayerSelectAmount');
    }
  }, [allowPayerSelectAmount]);

  React.useEffect(() => {
    if (chain) {
      setSelectedToken(tokensDetails[0]);
      setChainId(chain.name);
    }
  }, [chain]);

  return (
    <div className="bg-secondary-gradient border border border-darkBlue border-opacity-50 p-2 rounded-3xl shadow-md">
      {selectorVisibility && (
        <section className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen ">
          <div
            onClick={() => setSelectorVisibility(!selectorVisibility)}
            className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-30"
          ></div>
          <div className=" bg-white rounded-xl shadow-xl py-2 px-2 md:w-80 w-full m-5">
            <p className="font-base font-semibold text-slate-700 pl-4 pb-3 pt-2 border-b mb-3">
              Select a token
            </p>
            {tokensDetails
              .filter((token) => {
                if (chainId === 'Base') return token.label !== 'WBTC';
                return token.label !== 'cbBTC';
              })
              .map((token, i) => (
                <MenuItem
                  key={token.label}
                  onClick={() => {
                    setSelectedToken(token);
                    setSelectorVisibility(!selectorVisibility);
                  }}
                  value={token.label}
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
              ))}
          </div>
        </section>
      )}

      <div className="p-2 flex flex-col w-full relative">
        <div className="absolute left-2 -top-16 mb-2">
          <ErrorsUi errorMsg={badRequest} errorNtk={''} />
        </div>

        <p className="font-medium font-base text-sm text-white mb-2 pl-2">
          <span className="md:block hidden">Select amount to request</span>
          <span className="md:hidden">Requesting</span>
        </p>

        <div className="relative">
          {allowPayerSelectAmount ? (
            <input
              className="w-full border border-white rounded-xl font-medium text-3xl focus:outline-none bg-transparent text-white pl-4 h-16 placeholder:text-white"
              placeholder="Payer sets an amount"
              value={'Payer sets an amount'}
              readOnly
            />
          ) : (
            <input
              type="number"
              step="0.000000"
              className="w-full border border-white rounded-xl font-medium text-3xl focus:outline-none bg-transparent text-white pl-4 h-16 placeholder:text-white"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
            />
          )}
          <button
            type="button"
            className="absolute top-[-20px] right-[25px] bg-white shadow-md rounded-xl hover:shadow-xl"
            style={{ width: 110, height: 38 }}
            onClick={() => setSelectorVisibility(!selectorVisibility)}
          >
            <div className="flex items-center w-full ml-1">
              <Image
                alt={selectedToken.label}
                src={selectedToken.logo}
                width={30}
                height={30}
                className="pr-1 ml-1"
              />
              <span className="ml-1 text-slate-700 font-base font-semibold">
                {selectedToken.label}
              </span>
            </div>
          </button>
        </div>

        <label className="flex items-center font-base text-sm text-white pl-2">
          <span className="mr-3 mt-2">Let payer choose the amount</span>
          <div
            className={`w-8 h-4 bg-gray-400 rounded-full cursor-pointer ${
              allowPayerSelectAmount ? 'bg-green-500' : ''
            }`}
            onClick={() => setAllowPayerSelectAmount(!allowPayerSelectAmount)}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                allowPayerSelectAmount ? 'translate-x-4' : ''
              }`}
            ></div>
          </div>
        </label>

        <p className="font-medium font-base text-sm text-white mt-12 mb-2 pl-2">
          {`What's this for?`}
        </p>

        <div className="relative">
          <input
            className="border border-white rounded-xl font-medium text-[22px] focus:outline-none bg-transparent text-white pl-4 h-16 w-full placeholder:text-white"
            type="text"
            placeholder="coffee ☕"
            value={description}
            onChange={handleDescriptionChange}
            maxLength={MAX_CHARACTER_LIMIT}
          />
          <div className="absolute right-3 bottom-4 text-white text-[8px]">
            {characterCount}
          </div>
        </div>

        <button
          type="button"
          className="flex justify-center items-center border-white border font-base text-lg focus:outline-none w-full h-16 rounded-xl font-bold text-white hover:bg-white hover:text-slate-700 mt-12"
          onClick={isConnected ? createRequest : openConnectModal}
        >
          {ipfsLoading ? (
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
          ) : isConnected ? (
            'Create Woop'
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>

      {isShareActive && (
        <section className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen ">
          <div
            onClick={() => setIsShareActive(!isShareActive)}
            className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-30"
          ></div>
          <div className=" bg-accent border border-[#06225c66] rounded-3xl shadow-xl py-2 px-2 md:w-96 w-full m-5 z-50">
            <Share
              visibility={setIsShareActive}
              path={path}
              amount={amount}
              description={description}
              token={selectedToken}
            />
          </div>
        </section>
      )}
    </div>
  );
}
