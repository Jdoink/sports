import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { getWalletClient } from "@wagmi/core";
import { placeBet } from "../lib/contracts";
import { GET_TOP_LIQUIDITY_MARKET } from "../lib/queries";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [signer, setSigner] = useState(null);
    const [betting, setBetting] = useState(false);
    const [market, setMarket] = useState(null);
    const [clientReady, setClientReady] = useState(false);

    // ✅ Ensure Apollo runs only on the client
    useEffect(() => {
        setClientReady(true);
    }, []);

    // ✅ Fetch signer properly using wagmi/core
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

    // ✅ Fetch market data (GraphQL)
    const { data, loading, error } = useQuery(GET_TOP_LIQUIDITY_MARKET, { 
        skip: !clientReady || !address // ✅ Prevents Next.js pre-render error
    });

    // ✅ Set the betting market when data is available
    useEffect(() => {
        if (!loading && !error && data?.sportsMarkets?.length > 0) {
            setMarket(data.sportsMarkets[0]);
        }
    }, [loading, error, data]);

    // ✅ Function to place a bet
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

    // ✅ Show loading/error messages
    if (!clientReady) return <p>Loading...</p>;
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
