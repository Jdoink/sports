import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useAccount } from "wagmi";
import { getWalletClient } from "@wagmi/core"; // ✅ Use this instead of `useSigner`
import { placeBet } from "../lib/contracts";
import { GET_TOP_LIQUIDITY_MARKET } from "../lib/queries.js";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [signer, setSigner] = useState(null);
    const [betting, setBetting] = useState(false);
    const [market, setMarket] = useState(null);

    // ✅ Fetch signer (wallet client) properly
    useEffect(() => {
        async function fetchSigner() {
            if (!isConnected) return;
            try {
                const walletClient = await getWalletClient();
                setSigner(walletClient);
            } catch (error) {
                console.error("Failed to fetch signer:", error);
            }
        }
        fetchSigner();
    }, [isConnected]);

    // ✅ Apollo useQuery - Prevents Next.js SSR pre-render error
    const { data, loading, error } = useQuery(GET_TOP_LIQUIDITY_MARKET, { 
        skip: typeof window === "undefined" || !address,
        ssr: false  // ✅ Ensures Apollo runs only on the client
    });

    // ✅ Set the betting market when data is available
    useEffect(() => {
        if (!loading && !error && data?.sportsMarkets?.length > 0) {
            setMarket(data.sportsMarkets[0]); // Set first market with highest liquidity
        }
    }, [loading, error, data]);

    // ✅ Function to handle bet placement
    async function handleBet(team) {
        if (!signer) return alert("Connect your wallet first!");
        if (!market) return alert("No market data available!");

        setBetting(true);
        try {
            await placeBet(market.id, team, "1000000000000000", signer);
            alert("Bet placed successfully!");
        } catch (error) {
            console.error(error);
            alert("Bet failed!");
        }
        setBetting(false);
    }

    // ✅ Display loading, error, or no market states
    if (loading) return <p>Loading daily bet...</p>;
    if (error) return <p>Error loading market data</p>;
    if (!market) return <p>No available betting markets</p>;

    return (
        <div>
            <h1>Today's Bet</h1>
            <p>Match: {market.homeTeam} vs {market.awayTeam}</p>
            <button onClick={() => handleBet("home")} disabled={betting}>
                Bet on {market.homeTeam}
            </button>
            <button onClick={() => handleBet("away")} disabled={betting}>
                Bet on {market.awayTeam}
            </button>
        </div>
    );
}
