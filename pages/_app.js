import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// Fix: Ensure WalletConnect is set up properly
const { chains, publicClient } = configureChains(
  [mainnet, optimism],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Sports Betting MVP",
  projectId: "1234567890abcdef", // 🔥 Replace with your WalletConnect Project ID
  chains,
});

// ✅ Fix: Create Wagmi client correctly
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// ✅ Fix: Wrap the entire app with `WagmiConfig` and `RainbowKitProvider`
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
