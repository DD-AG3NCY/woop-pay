import * as React from "react";
import Head from "next/head";
import Footer from "../components/Footer";

import Alert from "@mui/material/Alert";
import styles from "./index.module.scss";
import cx from "classnames";

import { useAccount, useConnect } from "wagmi";
import Header from "../components/header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Payment from "../components/Payment/Payment";

export default function Home() {
  const { error } = useConnect();
  const [badRequest, setBadRequest] = React.useState<boolean>(false);
  const [amountZeroRequest, setAmountZeroRequest] =
    React.useState<boolean>(false);

  const { isConnected } = useAccount();
  const [connected, setConnected] = React.useState<boolean>(false);
  React.useEffect(() => setConnected(isConnected), [isConnected]);

  return (
    <>
      <Head>
        <title>woop-pay</title>
        <meta name="description" content="web3 payment requests made easy" />
        <link rel="icon" href="./icon.svg" />
      </Head>

      <Header />

      <article
        className={cx(
          styles.baseContainer,
          "h-screen w-full flex justify-center items-center"
        )}
      >
        <section
          className={cx(
            styles.containerBase,
            "h-screen w-full absolute top-0 z-0 opacity-50"
          )}
        ></section>

        <Container maxWidth="sm" className="w-full z-10">
          <Box
            component="form"
            className={cx(
              styles.containerBox,
              "p-2 rounded-3xl shadow-md w-full"
            )}
          >
            <Payment />
          </Box>
        </Container>
      </article>
      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </>
  );
}
