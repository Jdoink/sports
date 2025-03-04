import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { placeBet } from "../lib/contracts";
import { fetchNBAMarket } from "../lib/queries";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [betting, setBetting] = useState(false);

    // Fetch a single NBA market on load
    useEffect(() => {
        async function getMarket() {
            console.log("Fetching NBA market...");
            const nbaMarket = await fetchNBAMarket();
            if (nbaMarket) {
                setMarket(nbaMarket);
            } else {
                console.warn("No NBA markets found.");
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

            {/* Wallet Connect Button */}
            <ConnectButton />

            {/* Display Market Info or Loading Message */}
            {market ? (
                <>
                    <p>{market.homeTeam} vs {market.awayTeam}</p>
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
        </div>
    );
}
