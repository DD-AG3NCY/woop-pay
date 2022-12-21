import * as React from "react";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { pageview } from "../utils/ga";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli, chain.optimism, chain.arbitrum, chain.polygon],

  [
    publicProvider(),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ETHEREUM_MAINNET_API_KEY!,
    }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ETHEREUM_GOERLI_API_KEY!,
    }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_MAINNET_API_KEY!,
    }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_MAINNET_API_KEY!,
    }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_MAINNET_API_KEY!,
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "woop-pay",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const router = useRouter();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "light" : "dark",
        },
      }),
    [prefersDarkMode]
  );

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        id="ga-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-2TY295GGG4`}
      />
      <Script
        id="ga-script-2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-2TY295GGG4');
          `,
        }}
      />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider modalSize="compact" chains={chains}>
          <ThemeProvider theme={theme}>
            <CssBaseline>
              <Component {...pageProps} />
            </CssBaseline>
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
