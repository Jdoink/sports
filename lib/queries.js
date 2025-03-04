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
        console.log("API Response:", data);

        if (!data || data.length === 0) {
            console.warn("No NBA markets available.");
            return null;
        }

        // Step 2: Pick the first NBA market (ensuring a valid selection)
        const selectedMarket = data[0];

        // Step 3: Fetch full market details
        const marketDetailsResponse = await fetch(
            `https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets/${selectedMarket.gameId}`
        );

        if (!marketDetailsResponse.ok) {
            throw new Error(`Market details request failed with status: ${marketDetailsResponse.status}`);
        }

        const marketDetails = await marketDetailsResponse.json();
        console.log("Market Details:", marketDetails);

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
