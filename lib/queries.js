export async function fetchNBAMarket() {
    try {
        console.log("Fetching NBA markets...");

        // Fetch available NBA markets
        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA"
        );

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        console.log("API Response Data:", data);

        // Check if we received valid market data
        if (!data || !data.Basketball || !data.Basketball["4"] || data.Basketball["4"].length === 0) {
            throw new Error("No NBA markets returned from API.");
        }

        // Pick a random NBA market
        const marketsArray = data.Basketball["4"];
        const randomMarket = marketsArray[Math.floor(Math.random() * marketsArray.length)];

        console.log("Randomly selected market:", randomMarket);

        if (!randomMarket.gameId) {
            throw new Error("Selected market does not have a valid gameId.");
        }

        // Fetch full market details
        const marketDetailsResponse = await fetch(
            `https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets/${randomMarket.gameId}`
        );

        if (!marketDetailsResponse.ok) {
            throw new Error(`Market details request failed with status: ${marketDetailsResponse.status}`);
        }

        const marketDetails = await marketDetailsResponse.json();
        console.log("Market received:", marketDetails);

        return {
            gameId: marketDetails.gameId,
            homeTeam: marketDetails.homeTeam || "Home Team",
            awayTeam: marketDetails.awayTeam || "Away Team",
        };
    } catch (error) {
        console.error("Error fetching NBA market:", error);
        return null;
    }
}
