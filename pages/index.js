import { useState, useEffect } from "react";

export default function Home() {
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMarkets() {
            try {
                // ✅ Correct API request to fetch NBA markets on Optimism
                const response = await fetch(
                    "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA"
                );

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // ✅ Ensure there is at least one NBA game
                if (data.length === 0) {
                    throw new Error("No NBA games found.");
                }

                // ✅ Pick a random NBA game from the list
                const randomMarket = data[Math.floor(Math.random() * data.length)];

                setMarket(randomMarket);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMarkets();
    }, []);

    if (loading) return <p>Loading NBA market...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!market) return <p>No NBA markets available.</p>;

    return (
        <div>
            <h1>Random NBA Game Bet</h1>
            <p>Match: {market.homeTeam} vs {market.awayTeam}</p>
            <p>Maturity Date: {new Date(market.maturityDate * 1000).toLocaleString()}</p>
            <button onClick={() => alert(`Bet placed on ${market.homeTeam}`)}>
                Bet on {market.homeTeam}
            </button>
            <button onClick={() => alert(`Bet placed on ${market.awayTeam}`)}>
                Bet on {market.awayTeam}
            </button>
        </div>
    );
}
