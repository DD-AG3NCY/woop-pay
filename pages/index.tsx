import * as React from "react";
import Image from "next/image";
import Head from "next/head";
// import logo from "../public/web3-pay-logo.png";
import logo from "../public/logo.svg";
import Wallet from "../components/Wallet";
import WalletDisconnect from "../components/WalletDisconnected";
import Request from "../components/request/Request";
import Footer from "../components/Footer";

import Alert from "@mui/material/Alert";
import styles from "./index.module.scss";
import cx from "classnames";

import { useAccount, useConnect } from "wagmi";
import Header from "../components/header";

export default function Home() {
  const { error } = useConnect();
  const [badRequest, setBadRequest] = React.useState<boolean>(false);
  const [amountZeroRequest, setAmountZeroRequest] =
    React.useState<boolean>(false);
  const [noTokenRequest, setNoTokenRequest] = React.useState<boolean>(false);

  const { isConnected } = useAccount();
  const [connected, setConnected] = React.useState<boolean>(false);
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
      <Header />

      <article
        className={cx(
          styles.baseContainer,
          "h-screen w-full flex justify-center items-center"
        )}
      >
        <div className="fixed top-8 bg-white rounded">
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
        </div>

        <section
          className={cx(
            styles.containerBase,
            "h-screen w-full absolute top-0 z-0 opacity-50"
          )}></section>

        {
          <Request
            setBadRequest={setBadRequest}
            setAmountZeroRequest={setAmountZeroRequest}
            setNoTokenRequest={setNoTokenRequest}
          />
        }
      </article>
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </>
  );
}
