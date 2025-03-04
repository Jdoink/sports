import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// 🚀 Add your WalletConnect Project ID here
const projectId = "f9c18b102a0363ba79fd2ad3bc8ba6f3";

// Configure WalletConnect
const { chains, publicClient } = configureChains([optimism], [publicProvider()]);
const { connectors } = getDefaultWallets({
    appName: "Sports Betting MVP",
    projectId,
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export default function MyApp({ Component, pageProps }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
