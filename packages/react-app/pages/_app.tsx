import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { http, WagmiProvider, createConfig } from "wagmi";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// NERO Chain imports
import { neroChain } from "../lib/nerochain";
import { createPaymasterMiddleware } from "@nerochain/paymaster-sdk";
import { UserOpSDKProvider } from "@nerochain/userop-react";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet],
    },
  ],
  {
    appName: "LegacyVault",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  }
);

// NERO Paymaster middleware configuration
const paymasterMiddleware = createPaymasterMiddleware({
  paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
  policy: {
    gasSponsorship: "conditional", // Sponsor based on rules
    allowedTokens: ["NERO", "USDC", "ETH"], // NERO's token-as-gas feature
    userOpValidation: (userOp) => {
      if (userOp.callData.includes("transferLegacy")) {
        return { valid: true, sponsor: true };
      }
      return { valid: true, sponsor: false };
    },
  },
});

const config = createConfig({
  connectors,
  chains: [neroChain], // Using NERO Chain as primary
  transports: {
    [neroChain.id]: http(),
  },
  middleware: [paymasterMiddleware], // Adding Paymaster
});

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <UserOpSDKProvider 
          bundlerUrl={process.env.NEXT_PUBLIC_BUNDLER_URL!}
          entryPointAddress={process.env.NEXT_PUBLIC_ENTRYPOINT_ADDRESS!}
        >
          <RainbowKitProvider 
            chain={neroChain}
            theme={darkTheme({
              accentColor: '#7b3fe4', // NERO brand purple
              accentColorForeground: 'white',
            })}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </UserOpSDKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;