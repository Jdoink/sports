import { useState, useEffect } from "react";

export default function Home() {
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchNBAMarket() {
            try {
                const response = await fetch("https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA");
                
                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();

                if (data.length > 0) {
                    setMarket(data[0]); // Just take the first available NBA game
                } else {
                    throw new Error("No NBA markets found.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchNBAMarket();
    }, []);

    if (loading) return <p>Loading NBA market...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!market) return <p>No NBA markets available.</p>;

    return (
        <div>
            <h1>Random NBA Game Bet</h1>
            <p>Match: {market.homeTeam} vs {market.awayTeam}</p>
            <p>Maturity Date: {new Date(market.maturity * 1000).toLocaleString()}</p>
            <button onClick={() => alert(`Bet placed on ${market.homeTeam}`)}>
                Bet on {market.homeTeam}
            </button>
            <button onClick={() => alert(`Bet placed on ${market.awayTeam}`)}>
                Bet on {market.awayTeam}
            </button>
        </div>
    );
}
