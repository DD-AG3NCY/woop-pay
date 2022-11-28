import * as React from "react";
import Image from "next/image";
import Head from "next/head";

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
  const [badRequest, setBadRequest] = React.useState<boolean>(false);
  const [amountZeroRequest, setAmountZeroRequest] =
    React.useState<boolean>(false);
  const [noTokenRequest, setNoTokenRequest] = React.useState<boolean>(false);

  React.useEffect(() => setConnected(isConnected), [isConnected]);

  return (
    <>
      <Head>
        <title>web3-pay</title>
        <meta name="description" content="web3 payment requests made simple" />
        <link rel="icon" href="./icon.svg" />
      </Head>

      {error && (
        <Alert variant="filled" severity="error">
          {error.message}
        </Alert>
      )}

      {badRequest && (
        <Alert variant="filled" severity="error">
          {`Error: The payment creation failed`}
        </Alert>
      )}

      {amountZeroRequest && (
        <Alert variant="filled" severity="error">
          {`Error: You can't create a payment request with value 0`}
        </Alert>
      )}

      {noTokenRequest && (
        <Alert variant="filled" severity="error">
          {`Error: You can't create a payment request without selecting a token`}
        </Alert>
      )}

      <section className="h-screen w-screen flex justify-center items-center container bg-black">
        <div className="absolute top-0 left-0 w-screen flex items-center justify-between m-7 z-10">
          <div>
            <Image alt="web3-pay" src={logo} width={120} height={120} />
          </div>

          <Wallet />
        </div>
        <div className="h-screen w-screen absolute top-0 z-0 opacity-50 container">
          <style jsx>{`
            .container {
              background-repeat: repeat;
              background-image: url("/double-bubble-dark.webp");
              background-opacity: 0.2;
              background-blend-mode: soft-light;
              background-size: 400px;
            }
            p {
              color: blue;
            }
          `}</style>
        </div>
        <div className="z-10">
          {connected ? (
            <Request
              setBadRequest={setBadRequest}
              setAmountZeroRequest={setAmountZeroRequest}
              setNoTokenRequest={setNoTokenRequest}
            />
          ) : (
            <>
              <WalletDisconnect />
              <Wallet />
            </>
          )}
        </div>
      </section>
      <div className="absolute bottom-0 left-0 w-full mb-5">
        <Footer />
      </div>
    </>
  );
}
