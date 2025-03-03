import { useState, useEffect } from "react";

// Function to convert UNIX timestamp to readable date and time
const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
};

export default function Home() {
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch NBA markets and determine the one with the highest liquidity
    const fetchHighestLiquidityNBAMarket = async () => {
        try {
            const response = await fetch("https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA");
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            const data = await response.json();

            if (data && data.length > 0) {
                // Find the NBA market with the highest liquidity
                const highestLiquidityMarket = data.reduce((max, market) =>
                    market.liquidity > max.liquidity ? market : max
                );
                setMarket(highestLiquidityMarket);
            } else {
                throw new Error("No NBA betting markets found.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHighestLiquidityNBAMarket();

        // Calculate time until next 6 AM CST
        const now = new Date();
        const next6AM = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + (now.getHours() >= 6 ? 1 : 0),
            6, 0, 0, 0
        );
        const timeUntilNext6AM = next6AM - now;

        // Set a timeout to refresh at 6 AM CST daily
        const timeoutId = setTimeout(() => {
            fetchHighestLiquidityNBAMarket();
            setInterval(fetchHighestLiquidityNBAMarket, 24 * 60 * 60 * 1000);
        }, timeUntilNext6AM);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    if (loading) return <p>Loading NBA betting market...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!market) return <p>No available NBA betting markets</p>;

    return (
        <div>
            <h1>Today's Highest Liquidity NBA Bet</h1>
            <p>Match: {market.homeTeam} vs {market.awayTeam}</p>
            <p>Maturity Date: {formatDateTime(market.maturity)}</p>
            <p>Liquidity: {market.liquidity} USD</p>
            <button onClick={() => alert(`Bet placed on ${market.homeTeam}`)}>
                Bet on {market.homeTeam}
            </button>
            <button onClick={() => alert(`Bet placed on ${market.awayTeam}`)}>
                Bet on {market.awayTeam}
            </button>
        </div>
    );
}
