import * as React from "react";
import Footer from "../components/Footer";
import Payment from "../components/Payment/Payment";
import Header from "../components/Heading";

import styles from "./index.module.scss";
import cx from "classnames";

import { useAccount } from "wagmi";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import SEO from "../components/Seo";

export default function Home() {
  const { isConnected } = useAccount();
  const [connected, setConnected] = React.useState<boolean>(false);
  React.useEffect(() => setConnected(isConnected), [isConnected]);

  return (
    <>
      <SEO
        title="Woop Pay | Create Cryptocurrency Payment Requests"
        description="Woop Pay is a web application that simplifies cryptocurrency payment requests. You can connect your wallet to create a payment request and share it. Woop Pay supports native tokens ETHER and MATIC, and popular ERC20 tokens such as DAI, USDC, TETHER, WETH, and WBTC. It also supports multiple networks within the Ethereum ecosystem: Mainnet, Goerli, Arbitrum, Optimism, and Polygon."
        rrssImg="./RRSS.png"
      />

      <Header />

      <article
        className={cx(
          styles.baseContainer,
          "h-screen w-full flex justify-center items-center relative z-10"
        )}>
        <section
          className={cx(
            styles.containerBase,
            "h-screen w-full absolute top-0 z-0 opacity-50"
          )}></section>

        <Container maxWidth="sm" className="w-full z-10">
          <Box
            component="form"
            className={cx(
              styles.containerBox,
              "p-2 rounded-3xl shadow-md w-full"
            )}>
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
