import * as React from 'react';
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

interface TokenDetails {
  label: string;
  logo: string;
}

export default function Payment() {
  const [selectedToken, setSelectedToken] = React.useState<TokenDetails>(
    tokensDetails[0]
  );
  const [amount, setAmount] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [characterCount, setCharacterCount] =
    React.useState(MAX_CHARACTER_LIMIT);
  const [path, setPath] = React.useState<string>('');
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);
  const [selectorVisibility, setSelectorVisibility] =
    React.useState<boolean>(false);
  const [isShareActive, setIsShareActive] = React.useState<boolean>(false);
  const [badRequest, setBadRequest] = React.useState<string>('');
  const [allowPayerSelectAmount, setAllowPayerSelectAmount] =
    React.useState<boolean>(false);

  const { isConnected, address, chain } = useAccount();
  const { openConnectModal } = useConnectModal();

  const MIXPANEL_ID = process.env.NEXT_PUBLIC_MIXPANEL_ID;

  React.useEffect(() => {
    if (MIXPANEL_ID) {
      mixpanel.init(MIXPANEL_ID);
    }
  }, []);

  React.useEffect(() => {
    if (isConnected && address) {
      mixpanel.track('visit_woop_create_request', { Address: address });
    }
  }, [isConnected, address]);

  React.useEffect(() => {
    if (allowPayerSelectAmount) {
      setAmount('allowPayerSelectAmount');
    } else {
      setAmount('');
    }
  }, [allowPayerSelectAmount]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputDescription = event.target.value;
    if (inputDescription.length <= MAX_CHARACTER_LIMIT) {
      setDescription(inputDescription);
      setCharacterCount(MAX_CHARACTER_LIMIT - inputDescription.length);
    }
  };

  const createRequest = async () => {
    setBadRequest('');
    if (!amount || amount === '0') {
      setBadRequest('The requested amount must be higher than zero');
      return;
    }

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
        tokenAddress: selectToken(selectedToken.label, chain?.name),
      };

      const ipfsPath = await uploadIpfs(data);
      mixpanel.track('create_woop', {
        Token: selectedToken.label,
        Network: chain?.name || '',
        Amount: amount,
        Address: address,
        Link: ipfsPath,
      });
      sendNotificationRequest(
        address,
        chain?.name,
        amount,
        description,
        selectedToken.label,
        ipfsPath
      );
      setPath(ipfsPath);
      setIsShareActive(true);
    } catch (error) {
      console.error(error);
      setBadRequest('Oops! Something went wrong. Please try again later.');
    } finally {
      setIpfsLoading(false);
    }
  };

  const filteredTokens = React.useMemo(() => {
    return tokensDetails.filter((token) => {
      if (chain?.name === 'Base') return token.label !== 'WBTC';
      return token.label !== 'cbBTC';
    });
  }, [chain]);

  return (
    <div className="bg-secondary-gradient border border-darkBlue border-opacity-50 p-2 rounded-3xl shadow-md">
      {selectorVisibility && (
        <TokenSelectorModal
          tokens={filteredTokens}
          onSelect={(token) => {
            setSelectedToken(token);
            setSelectorVisibility(false);
          }}
          onClose={() => setSelectorVisibility(false)}
        />
      )}

      <div className="p-2 flex flex-col w-full relative">
        {badRequest && (
          <div className="absolute left-2 -top-16 mb-2">
            <ErrorsUi errorMsg={badRequest} errorNtk="" />
          </div>
        )}

        <label className="font-medium font-base text-sm text-white mb-2 pl-2">
          {isConnected ? 'Select amount to request' : 'Requesting'}
        </label>

        <div className="relative">
          <input
            type="number"
            step="0.000000"
            className="w-full border border-white rounded-xl font-medium text-3xl focus:outline-none bg-transparent text-white pl-4 h-16 placeholder:text-white"
            placeholder={
              allowPayerSelectAmount ? 'Payer sets an amount' : '0.00'
            }
            value={allowPayerSelectAmount ? '' : amount}
            onChange={handleAmountChange}
            disabled={allowPayerSelectAmount}
          />
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

        <label className="flex items-center font-base text-sm text-white pl-2 mt-4">
          <span className="mr-3">Let payer choose the amount</span>
          <input
            type="checkbox"
            checked={allowPayerSelectAmount}
            onChange={() => setAllowPayerSelectAmount(!allowPayerSelectAmount)}
            className="toggle-checkbox"
          />
        </label>

        <label className="font-medium font-base text-sm text-white mt-8 mb-2 pl-2">
          What&apos;s this for?
        </label>

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
              className="animate-spin rounded-full w-5 h-5 mr-3 bg-white"
              viewBox="0 0 24 24"
            >
              {/* SVG content */}
            </svg>
          ) : isConnected ? (
            'Create Woop'
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>

      {isShareActive && (
        <ShareModal
          onClose={() => setIsShareActive(false)}
          path={path}
          amount={amount}
          description={description}
          token={selectedToken}
        />
      )}
    </div>
  );
}

interface TokenSelectorModalProps {
  tokens: TokenDetails[];
  onSelect: (token: TokenDetails) => void;
  onClose: () => void;
}

function TokenSelectorModal({
  tokens,
  onSelect,
  onClose,
}: TokenSelectorModalProps) {
  return (
    <section className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
      <div
        onClick={onClose}
        className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-30"
      ></div>
      <div className="bg-white rounded-xl shadow-xl py-2 px-2 md:w-80 w-full m-5">
        <p className="font-base font-semibold text-slate-700 pl-4 pb-3 pt-2 border-b mb-3">
          Select a token
        </p>
        {tokens.map((token) => (
          <MenuItem
            key={token.label}
            onClick={() => onSelect(token)}
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
  );
}

interface ShareModalProps {
  onClose: () => void;
  path: string;
  amount: string;
  description: string;
  token: TokenDetails;
}

function ShareModal({
  onClose,
  path,
  amount,
  description,
  token,
}: ShareModalProps) {
  return (
    <section className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
      <div
        onClick={onClose}
        className="fixed top-0 left-0 w-screen h-screen bg-slate-900 opacity-30"
      ></div>
      <div className="bg-accent border border-[#06225c66] rounded-3xl shadow-xl py-2 px-2 md:w-96 w-full m-5 z-50">
        <Share
          visibility={onClose}
          path={path}
          amount={amount}
          description={description}
          token={token}
        />
      </div>
    </section>
  );
}
