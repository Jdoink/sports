import { useState, useEffect } from "react";

export default function Home() {
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMarket() {
            try {
                const response = await fetch("https://api.thalesmarket.io/overtime/markets?size=1");
                if (!response.ok) {
                    throw new Error("Failed to fetch market data");
                }
                const data = await response.json();

                // Check if any market exists
                if (data.length > 0) {
                    setMarket(data[0]); // Use first market
                } else {
                    throw new Error("No available betting markets found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMarket();
    }, []);

    if (loading) return <p>Loading daily bet...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!market) return <p>No available betting markets</p>;

    return (
        <div>
            <h1>Today's Bet</h1>
            <p>Match: {market.homeTeam} vs {market.awayTeam}</p>
            <button onClick={() => alert(`Bet placed on ${market.homeTeam}`)}>
                Bet on {market.homeTeam}
            </button>
            <button onClick={() => alert(`Bet placed on ${market.awayTeam}`)}>
                Bet on {market.awayTeam}
            </button>
        </div>
    );
}
