export async function fetchNBAMarket() {
    try {
        console.log("Fetching NBA markets...");

        // Step 1: Fetch all NBA markets
        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA"
        );

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            throw new Error("No NBA markets available.");
        }

        console.log("NBA markets received:", data);

        // Step 2: Pick a random NBA market
        const randomMarket = data[Math.floor(Math.random() * data.length)];

        // Step 3: Fetch full details using the market's gameId
        const marketDetailsResponse = await fetch(
            `https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets/${randomMarket.gameId}`
        );

        if (!marketDetailsResponse.ok) {
            throw new Error(`Market details request failed with status: ${marketDetailsResponse.status}`);
        }

        const marketDetails = await marketDetailsResponse.json();

        console.log("Market details:", marketDetails);

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
