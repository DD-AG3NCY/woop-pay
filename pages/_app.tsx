import * as React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia, polygon, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Smartlook from "smartlook-client";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const { chains, publicClient } = configureChains(
  [mainnet, sepolia, optimism, arbitrum, polygon],

  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ETHEREUM_MAINNET_API_KEY!,
    }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ETHEREUM_SEPOLIA_API_KEY!,
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
    publicProvider(),
  ]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "";

const { connectors } = getDefaultWallets({
  appName: "Woop Pay",
  projectId,
  chains,
});

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  React.useEffect(() => {
    Smartlook.init(process.env.NEXT_PUBLIC_SMARTLOOK_KEY ?? "");
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "light" : "dark",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <>
      <WagmiConfig config={wagmiClient}>
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
