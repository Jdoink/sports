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
        console.log("Full NBA Markets Response:", data); // Debugging log

        if (!data || data.length === 0) {
            throw new Error("No NBA markets available.");
        }

        // Step 2: Pick a market that has valid team names
        const validMarkets = data.filter(market => market.homeTeam && market.awayTeam);
        if (validMarkets.length === 0) {
            throw new Error("No valid NBA markets found.");
        }

        const randomMarket = validMarkets[Math.floor(Math.random() * validMarkets.length)];

        // Step 3: Fetch full details using gameId
        const marketDetailsResponse = await fetch(
            `https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets/${randomMarket.gameId}`
        );

        if (!marketDetailsResponse.ok) {
            throw new Error(`Market details request failed with status: ${marketDetailsResponse.status}`);
        }

        const marketDetails = await marketDetailsResponse.json();
        console.log("Selected Market Details:", marketDetails); // Debugging log

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

