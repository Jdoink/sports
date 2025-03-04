import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { placeBet } from "../lib/contracts";
import { fetchNBAMarket } from "../lib/queries";
import dynamic from "next/dynamic"; // <-- Important for Client-Side Components

// Ensure client-side components are dynamically imported
const WalletConnectButton = dynamic(() => import("../components/WalletConnectButton"), { ssr: false });

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [betting, setBetting] = useState(false);

    // Fetch a single NBA market on load
    useEffect(() => {
        async function getMarket() {
            try {
                console.log("Fetching market...");
                const nbaMarket = await fetchNBAMarket();
                if (nbaMarket) {
                    console.log("Market received:", nbaMarket);
                    setMarket(nbaMarket);
                } else {
                    console.log("No NBA market found.");
                }
            } catch (error) {
                console.error("Error fetching market:", error);
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

    return (
        <div>
            <h1>NBA Betting</h1>
            <WalletConnectButton /> {/* Ensure wallet connection component loads properly */}
            
            {market ? (
                <div>
                    <p>{market.homeTeam} vs {market.awayTeam}</p>
                    <button onClick={() => handleBet("home")} disabled={betting}>
                        Bet on {market.homeTeam}
                    </button>
                    <button onClick={() => handleBet("away")} disabled={betting}>
                        Bet on {market.awayTeam}
                    </button>
                </div>
            ) : (
                <p style={{ color: "red" }}>Error: No NBA market found.</p>
            )}

            <div style={{ marginTop: "20px", border: "1px solid #000", padding: "10px" }}>
                <h3>Debug Logs:</h3>
                <p>Market Data: {market ? JSON.stringify(market) : "Loading..."}</p>
            </div>
        </div>
    );
}
