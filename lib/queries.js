export async function fetchTopLiquidityMarket() {
    const response = await fetch("https://api.thalesmarket.io/overtime/markets", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch market data");
    }

    const markets = await response.json();
    
    // Sort markets by liquidity (assuming higher liquidity is better)
    markets.sort((a, b) => b.liquidity - a.liquidity);

    return markets.length > 0 ? markets[0] : null; // Return the highest liquidity market
}
