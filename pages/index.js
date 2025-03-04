import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { fetchNBAMarket } from "../lib/queries";
import dynamic from "next/dynamic";

// ✅ Dynamically import to prevent server crash
const WalletConnectButton = dynamic(() => import("../components/WalletConnectButton"), { ssr: false });

export default function Home() {
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState(null);
    const [isClient, setIsClient] = useState(false);

    // ✅ Ensure this only runs on the browser
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return; // Prevents SSR crash
        async function loadMarket() {
            try {
                const nbaMarket = await fetchNBAMarket();
                if (nbaMarket) {
                    setMarket(nbaMarket);
                } else {
                    console.error("No NBA market found.");
                }
            } catch (error) {
                console.error("Error fetching market:", error);
            }
        }
        loadMarket();
    }, [isClient]);

    if (!isClient) return <p>Loading...</p>; // Prevents `window` errors

    return (
        <div>
            <h1>NBA Betting</h1>
            <WalletConnectButton />

            {market ? (
                <div>
                    <p>{market.homeTeam} vs {market.awayTeam}</p>
                    <button onClick={() => alert("Bet on Home Team")}>Bet on {market.homeTeam}</button>
                    <button onClick={() => alert("Bet on Away Team")}>Bet on {market.awayTeam}</button>
                </div>
            ) : (
                <p style={{ color: "red" }}>No NBA market found.</p>
            )}

            <div style={{ marginTop: "20px", border: "1px solid #000", padding: "10px" }}>
                <h3>Debug Logs:</h3>
                <p>Market Data: {market ? JSON.stringify(market) : "Loading..."}</p>
            </div>
        </div>
    );
}
