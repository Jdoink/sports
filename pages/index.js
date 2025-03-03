import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { placeBet } from "../lib/contracts";
import { fetchNBAMarket } from "../lib/queries";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [betting, setBetting] = useState(false);

    useEffect(() => {
        async function getMarket() {
            try {
                const nbaMarket = await fetchNBAMarket();
                if (nbaMarket) {
                    setMarket(nbaMarket);
                } else {
                    throw new Error("No NBA market found.");
                }
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getMarket();
    }, []);

    async function handleBet(team) {
        if (!address) return alert("Connect your wallet first!");
        if (!market) return alert("No market data available!");

        setBetting(true);
        try {
            await placeBet(market.gameId, team, "1000000000000000", address);
            alert("Bet placed successfully!");
        } catch (error) {
            console.error("Bet failed:", error);
            alert("Bet failed!");
        }
        setBetting(false);
    }

    if (loading) return <p>Loading NBA market...</p>;
    if (!market) return <p>No NBA markets available.</p>;

    return (
        <div>
            <h1>NBA Betting</h1>
            <p>
                {market.homeTeam} vs {market.awayTeam}
            </p>
            <button onClick={() => handleBet("home")} disabled={betting}>
                Bet on {market.homeTeam}
            </button>
            <button onClick={() => handleBet("away")} disabled={betting}>
                Bet on {market.awayTeam}
            </button>
        </div>
    );
}
