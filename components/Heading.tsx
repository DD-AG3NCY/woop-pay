import Image from "next/image";
import logo from "../public/logo.svg";
import logoMobile from "../public/icon.svg";
import Wallet from "./Wallet";
import styles from "./Wallet.module.scss";
import notificationStyles from "./Notification/notification.module.scss";
import { retrieveSubscriptions, optIn } from "../utils/push";
import cx from "classnames";
import { useAccount, useWalletClient, useNetwork } from "wagmi";

import React from "react";
import Link from "next/link";

type IHeaderProps = {};

const defaultProps = {};

const Header: React.FC<IHeaderProps> = (props) => {
  const { address } = useAccount();
  const { data: signer } = useWalletClient();
  const { chain } = useNetwork();
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
      <Link href={"/"}>
        <div>
          <Image
            alt="woop-pay"
            src={logo}
            width={260}
            height={120}
            className={cx(styles.image, "hidden md:block")}
          />
          <Image
            alt="woop-pay"
            src={logoMobile}
            width={40}
            height={40}
            className={cx("md:hidden")}
          />
        </div>
      </Link>

      <div className="flex">
        {isSubscribed ? (
          <div className="flex text-black text-center mr-3">
            <Link
              href={"/dashboard"}
              className={cx(
                notificationStyles.notificationButton,
                "font-bold flex items-center"
              )}
            >
              Dashboard
            </Link>
          </div>
        ) : isMainnet ? (
          <button
            type="button"
            onClick={activateNotifications}
            className={cx(
              notificationStyles.notificationButton,
              "font-bold flex items-center text-black text-center mr-3 text-sm"
            )}
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
