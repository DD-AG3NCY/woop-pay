import * as React from "react";
import { useRouter } from "next/router";
import Homepage from "../components/Home/Homepage";
import Layout from "../components/Layout";
import SEO from "../components/Seo";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <SEO
        title="Woop Pay | Create Cryptocurrency Payment Requests"
        description="Woop Pay is a web application that simplifies cryptocurrency payment requests. You can connect your wallet to create a payment request and share it. Woop Pay supports native tokens ETHER and MATIC, and popular ERC20 tokens such as DAI, USDC, TETHER, WETH, and WBTC. It also supports multiple networks within the Ethereum ecosystem: Mainnet, Goerli, Arbitrum, Optimism, and Polygon."
        rrssImg="./RRSS.png"
      />
      <Layout>
        <Homepage
          onNavigateToPaymentRequest={() => router.push("/request")}
          onNavigateToGenerateButton={() => router.push("/customize")}
        />
      </Layout>
    </>
  );
}
