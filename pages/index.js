import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { placeBet } from "../lib/contracts";
import { fetchNBAMarket } from "../lib/queries";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [betting, setBetting] = useState(false);

    // Fetch a single NBA Moneyline market on load
    useEffect(() => {
        async function getMarket() {
            console.log("Fetching NBA markets...");
            const nbaMarket = await fetchNBAMarket();
            if (nbaMarket) {
                console.log("Market received:", nbaMarket);
                setMarket(nbaMarket);
            } else {
                console.error("No NBA market found.");
            }
        }
        getMarket();
    }, []);

    async function handleBet(team) {
        if (!address) return alert("Connect your wallet first!");
        if (!market) return alert("No market data available!");

        const amount = prompt("Enter bet amount (e.g. 10):");
        if (!amount || isNaN(amount)) return alert("Invalid amount");

        const paymentMethod = confirm("Press OK to use USDC, Cancel to use ETH")
            ? "USDC"
            : "ETH";

        setBetting(true);
        try {
            await placeBet(market.gameId, team, amount, paymentMethod);
            alert(`Bet placed successfully on ${team}!`);
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
                <p style={{ color: "red" }}>Error: No NBA market found.</p>
            )}
            <br />
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
                <h3>Debug Logs:</h3>
                <p>Market Data: {market ? JSON.stringify(market) : "Loading..."}</p>
            </div>
        </div>
    );
}
