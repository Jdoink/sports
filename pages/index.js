import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useAccount, useSigner } from "wagmi";
import { placeBet } from "../lib/contracts";
import { GET_TOP_LIQUIDITY_MARKET } from "../lib/queries.js";

export default function Home() {
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const [betting, setBetting] = useState(false);
    const [market, setMarket] = useState(null);

    // Fetch market data but only on client-side (to prevent Next.js pre-render error)
    const { data, loading, error } = useQuery(GET_TOP_LIQUIDITY_MARKET, { skip: typeof window === "undefined" });

    useEffect(() => {
        if (!loading && !error && data?.sportsMarkets?.length > 0) {
            setMarket(data.sportsMarkets[0]); // Set the first market with highest liquidity
        }
    }, [loading, error, data]);

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
