import * as React from "react";
import Image from "next/image";
import logo from "../public/web3-pay-logo.png";
import Wallet from "../components/Wallet";
import WalletDisconnect from "../components/WalletDisconnected";
import Request from "../components/Request";
import Footer from "../components/Footer";

import { useAccount, useConnect } from "wagmi";

export default function Home() {
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const [connected, setConnected] = React.useState<boolean>(false);

  React.useEffect(() => setConnected(isConnected), [isConnected]);

  return (
    <>
      <div className="flex items-center justify-between m-7">
        <Image alt="web3-pay" src={logo} width={200} height={200} />
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
