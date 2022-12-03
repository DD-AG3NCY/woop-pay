import Image from "next/image";
import logo from "../public/logo.svg";
import Wallet from "./Wallet";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type IHeaderProps = {};

const defaultProps = {};

const Header: React.FC<IHeaderProps> = (props) => {
  const {} = props;

  useEffect(() => {}, []);

  return (
    <Link
      className="absolute top-0 left-0 w-full flex justify-between p-7 z-10"
      href={"/"}>
      <div>
        <Image alt="web3-pay" src={logo} width={280} height={120} />
        <p className="font-base text-xs text-white mt-2 ml-1 opacity-60">
          Web 3 payments made easy
        </p>
      </div>

      <div className="hidden md:block">
        <Wallet />
      </div>
    </Link>
  );
};

Header.defaultProps = defaultProps;

export default Header;
