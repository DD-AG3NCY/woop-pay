import Image from "next/image";
import logo from "../public/WoopPayLogo.svg";
import logoMobile from "../public/icon.svg";
import Wallet from './Wallet';
import { retrieveSubscriptions, optIn } from '../utils/push';
import { useAccount, useWalletClient } from 'wagmi';

import React from 'react';
import Link from 'next/link';

type IHeaderProps = {};

const defaultProps = {};

const Header: React.FC<IHeaderProps> = () => {
  const { address } = useAccount();
  const { data: signer } = useWalletClient();
  const { chain } = useAccount();
  const [showNotification, setShowNotification] =
    React.useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const [isMainnet, setIsMainnet] = React.useState<boolean>(false);

  const activateNotifications = async () => {
    const res: any = await optIn(address, signer);
    if (res) {
      setIsSubscribed(true);
    }
  };

  const retrieveIsSubscribed = async () => {
    const subs = await retrieveSubscriptions(address);
    setIsSubscribed(subs);
  };

  React.useEffect(() => {
    if (address) {
      setShowNotification(true);
      retrieveIsSubscribed();
    } else {
      setShowNotification(false);
    }
  }, [address]);

  React.useEffect(() => {
    if (chain?.id == 1) {
      setIsMainnet(true);
    } else {
      setIsMainnet(false);
    }
  }, [chain]);

  return (
    <div className="absolute top-0 left-0 w-full flex justify-between p-7 z-30 items-center">
      <Link href={'/'}>
        <div>
          <Image
            alt="woop-pay"
            src={logo}
            width={190}
            height={120}
            className="hidden md:block w-[160px] mr-[5px]"
          />
          <Image
            alt="woop-pay"
            src={logoMobile}
            width={40}
            height={40}
            className={'md:hidden'}
          />
        </div>
      </Link>

      <div className="flex">
        {isSubscribed ? (
          <div className="flex text-black text-center mr-3">
            <Link
              href={'/dashboard'}
              className="bg-white border-none cursor-pointer outline-none rounded-[14px] h-[40px] w-[105px] flex justify-center items-center font-bold"
            >
              Dashboard
            </Link>
          </div>
        ) : isMainnet ? (
          <button
            type="button"
            onClick={activateNotifications}
            className="bg-white border-none cursor-pointer outline-none rounded-[14px] h-[40px] w-[105px] flex justify-center items-center font-bold text-black text-center mr-3 text-sm"
          >
            📢 Enable dashboard
          </button>
        ) : (
          <></>
        )}
        <Wallet />
      </div>
    </div>
  );
};

Header.defaultProps = defaultProps;

export default Header;
