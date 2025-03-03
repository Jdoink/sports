import { useState, useEffect } from "react";

export default function Home() {
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMarkets() {
            try {
                const response = await fetch("https://api.thalesmarket.io/overtime/markets");
                if (!response.ok) {
                    throw new Error("Failed to fetch market data");
                }
                const data = await response.json();
                setMarket(data[0]); // Get the first available market
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMarkets();
    }, []);

    if (loading) return <p>Loading daily bet...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!market) return <p>No available betting markets</p>;

    return (
        <div>
            <h1>Today's Bet</h1>
            <p>Match: {market.homeTeam} vs {market.awayTeam}</p>
            <button onClick={() => alert(`Bet placed on ${market.homeTeam}`)}>Bet on {market.homeTeam}</button>
            <button onClick={() => alert(`Bet placed on ${market.awayTeam}`)}>Bet on {market.awayTeam}</button>
        </div>
    );
}
