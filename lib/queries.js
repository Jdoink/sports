export async function fetchNBAMarket() {
    try {
        console.log("Fetching NBA markets...");

        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA"
        );

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        // Verify if we have valid basketball markets
        if (!data.Basketball || !data.Basketball[4] || data.Basketball[4].length === 0) {
            throw new Error("No NBA markets returned from API.");
        }

        // Select a random market from the available list
        const nbaMarkets = data.Basketball[4];
        const randomMarket = nbaMarkets[Math.floor(Math.random() * nbaMarkets.length)];

        console.log("Randomly selected market:", randomMarket);

        return {
            gameId: randomMarket.gameId,
            homeTeam: randomMarket.homeTeam || "Home Team",
            awayTeam: randomMarket.awayTeam || "Away Team",
        };
    } catch (error) {
        console.error("Error fetching NBA market:", error);
        return null;
    }
}
