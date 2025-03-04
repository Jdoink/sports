import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// Setup blockchain networks
const { chains, publicClient } = configureChains(
  [mainnet, optimism], 
  [publicProvider()]
);

// Configure wallet connections
const { connectors } = getDefaultWallets({
  appName: "Sports Betting MVP",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Replace with a real WalletConnect project ID
  chains,
});

// Create Wagmi client
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
