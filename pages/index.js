import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { placeBet } from "../lib/contracts";
import { fetchNBAMarket } from "../lib/queries";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [betting, setBetting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch a single NBA market on load
    useEffect(() => {
        async function getMarket() {
            setLoading(true);
            setError("");
            console.log("Fetching market...");

            const nbaMarket = await fetchNBAMarket();
            if (nbaMarket) {
                setMarket(nbaMarket);
            } else {
                setError("No NBA market found.");
            }
            setLoading(false);
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

    return (
        <div>
            <h1>NBA Betting</h1>
            <ConnectButton />

            {loading ? (
                <p>Loading NBA market...</p>
            ) : error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
                <>
                    <p>
                        {market.homeTeam} vs {market.awayTeam}
                    </p>
                    <button onClick={() => handleBet("home")} disabled={betting}>
                        Bet on {market.homeTeam}
                    </button>
                    <button onClick={() => handleBet("away")} disabled={betting}>
                        Bet on {market.awayTeam}
                    </button>
                </>
            )}

            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid gray" }}>
                <h3>Debug Logs:</h3>
                <p>Market Data: {loading ? "Loading..." : market ? JSON.stringify(market) : "No data"}</p>
            </div>
        </div>
    );
}
