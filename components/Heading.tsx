import Image from "next/image";
import logo from "../public/logo.svg";
import logoMobile from "../public/icon.svg";
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
        <Wallet />
        {showNotification && <Notification />}
      </div>
    </div>
  );
};

Header.defaultProps = defaultProps;

export default Header;
