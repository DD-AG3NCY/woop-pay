import * as React from "react";
import Image from "next/image";
import logo from "../public/web3-pay-logo.png";
import Wallet from "../components/Wallet";
import WalletDisconnect from "../components/WalletDisconnected";
import Request from "../components/Request";
import Footer from "../components/Footer";

import Alert from "@mui/material/Alert";

import { useAccount, useConnect } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  const { error } = useConnect();
  const [connected, setConnected] = React.useState<boolean>(false);

  React.useEffect(() => setConnected(isConnected), [isConnected]);

  return (
    <>
      {error && (
        <Alert variant="filled" severity="error">
          {error.message}
        </Alert>
      )}

      <div className="flex items-center justify-between m-7">
        <Image alt="web3-pay" src={logo} width={150} height={150} />
        <Wallet />
      </div>

      {connected ? (
        <Request />
      ) : (
        <>
          <WalletDisconnect />
          <Wallet />
        </>
      )}

      <Footer />
    </>
  );
}
