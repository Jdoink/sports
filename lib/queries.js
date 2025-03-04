export async function fetchNBAMarket() {
    try {
        console.log("Fetching NBA markets...");

        // Fetch NBA markets
        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA"
        );

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data); // <-- Print full response

        // Check if data is empty or undefined
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.error("No NBA markets returned from API.");
            return null;
        }

        // Pick a random NBA market
        const randomMarket = data[Math.floor(Math.random() * data.length)];
        console.log("Randomly selected market:", randomMarket);

        // Check if randomMarket is valid before fetching details
        if (!randomMarket || !randomMarket.gameId) {
            console.error("Invalid market structure:", randomMarket);
            return null;
        }

        // Fetch full market details
        const marketDetailsResponse = await fetch(
            `https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets/${randomMarket.gameId}`
        );

        if (!marketDetailsResponse.ok) {
            throw new Error(`Market details request failed with status: ${marketDetailsResponse.status}`);
        }

        const marketDetails = await marketDetailsResponse.json();
        console.log("Market Details Response:", marketDetails);

        return {
            gameId: marketDetails.gameId,
            homeTeam: marketDetails.homeTeam || "Home Team",
            awayTeam: marketDetails.awayTeam || "Away Team",
            odds: marketDetails.odds ? marketDetails.odds.map(odd => odd.normalizedImplied) : []
        };
    } catch (error) {
        console.error("Error fetching NBA market:", error);
        return null;
    }
}
