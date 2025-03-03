import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { fetchTopLiquidityMarket } from "../lib/queries";
import { placeBet } from "../lib/contracts";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [betting, setBetting] = useState(false);

    // Fetch the market with highest liquidity
    useEffect(() => {
        async function getMarket() {
            try {
                const marketData = await fetchTopLiquidityMarket();
                setMarket(marketData);
            } catch (error) {
                console.error("Failed to fetch market:", error);
            }
        }
        getMarket();
    }, []);

    // Handle bet placement
    async function handleBet(team) {
        if (!isConnected) return alert("Connect your wallet first!");
        if (!market) return alert("No market data available!");

        setBetting(true);
        try {
            await placeBet(market.id, team, "1000000000000000", address);
            alert("Bet placed successfully!");
        } catch (error) {
            console.error(error);
            alert(`Bet failed: ${error.message}`);
        }
        setBetting(false);
    }

    if (!market) return <p>Loading market data...</p>;

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
