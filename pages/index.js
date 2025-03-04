import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { placeBet } from "../lib/contracts";
import { fetchNBAMarket } from "../lib/queries";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function Home() {
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const [market, setMarket] = useState(null);
    const [betting, setBetting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        async function getMarket() {
            console.log("Fetching market...");
            const nbaMarket = await fetchNBAMarket();
            if (nbaMarket) {
                console.log("Market received:", nbaMarket);
                setMarket(nbaMarket);
            } else {
                setErrorMessage("No NBA market found.");
            }
        }
        getMarket();
    }, []);

    async function handleBet(team) {
        if (!isConnected) {
            openConnectModal();
            return alert("Please connect your wallet first!");
        }
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
            {!isConnected ? (
                <button onClick={openConnectModal}>Connect Wallet</button>
            ) : (
                <p>Connected: {address}</p>
            )}
            
            {market ? (
                <>
                    <p>{market.homeTeam} vs {market.awayTeam}</p>
                    <p>Odds: {market.odds.join(", ")}</p>
                    <button onClick={() => handleBet("home")} disabled={betting}>
                        Bet on {market.homeTeam}
                    </button>
                    <button onClick={() => handleBet("away")} disabled={betting}>
                        Bet on {market.awayTeam}
                    </button>
                </>
            ) : (
                <p>Loading NBA market...</p>
            )}

            {/* Debugging Section - REMOVE THIS ONCE FIXED */}
            {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
            <div style={{ backgroundColor: "#f4f4f4", padding: "10px", marginTop: "20px" }}>
                <h3>Debug Logs:</h3>
                <p>Market Data: {market ? JSON.stringify(market, null, 2) : "Loading..."}</p>
            </div>
        </div>
    );
}
