import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// Configure supported chains (Optimism & Ethereum mainnet)
const { chains, publicClient } = configureChains(
    [optimism, mainnet], 
    [publicProvider()]
);

// Configure Wallet Connect
const { connectors } = getDefaultWallets({
    appName: "Sports Betting App",
    projectId: "f9c18b102a0363ba79fd2ad3bc8ba6f3", // Your WalletConnect project ID
    chains
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
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
