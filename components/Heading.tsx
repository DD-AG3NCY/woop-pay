import Image from "next/image";
import logo from "../public/logo.svg";
import Wallet from "./Wallet";
import styles from "./Wallet.module.scss";
import Notification from "./Notification/Notification";
import cx from "classnames";
import { useAccount } from "wagmi";

import React from "react";
import Link from "next/link";

type IHeaderProps = {};

const defaultProps = {};

const Header: React.FC<IHeaderProps> = (props) => {
  const { address } = useAccount();
  const [showNotification, setShowNotification] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (address) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [address]);

  return (
    <div className="absolute top-0 left-0 w-full flex justify-between p-7 z-10">
      <Link href={"/"}>
        <div>
          <Image
            alt="woop-pay"
            src={logo}
            width={260}
            height={120}
            className={cx(styles.image)}
          />
          <p
            className={cx(
              styles.image,
              "font-base text-xs text-white mt-2 ml-1 opacity-60"
            )}>
            Web 3 payments made simple
          </p>
        </div>
      </Link>

      <div className="flex">
        <Wallet />
        {showNotification && <Notification />}
      </div>
    </div>
  );
};

Header.defaultProps = defaultProps;

export default Header;
