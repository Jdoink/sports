export async function fetchNBAMarket() {
    try {
        console.log("Fetching NBA markets...");

        // Fetch all NBA markets from Overtime Markets API
        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA"
        );

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched NBA markets:", data);

        if (!data || data.length === 0) {
            throw new Error("No NBA markets available.");
        }

        // Pick a random market from the results
        const randomMarket = data[Math.floor(Math.random() * data.length)];

        if (!randomMarket || !randomMarket.gameId) {
            throw new Error("Invalid market data received.");
        }

        console.log("Selected NBA market:", randomMarket);

        // Fetch full details of the selected market
        const marketDetailsResponse = await fetch(
            `https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets/${randomMarket.gameId}`
        );

        if (!marketDetailsResponse.ok) {
            throw new Error(`Market details request failed with status: ${marketDetailsResponse.status}`);
        }

        const marketDetails = await marketDetailsResponse.json();
        console.log("Fetched market details:", marketDetails);

        return {
            gameId: marketDetails.gameId,
            homeTeam: marketDetails.homeTeam || "Unknown Home Team",
            awayTeam: marketDetails.awayTeam || "Unknown Away Team",
        };
    } catch (error) {
        console.error("Error fetching NBA market:", error.message);
        return null;
    }
}
