export async function fetchNBAMarket() {
    try {
        console.log("Fetching NBA Moneyline markets...");
        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA"
        );

        if (!response.ok) throw new Error(`API request failed with status: ${response.status}`);

        const data = await response.json();
        if (!data || !data.Basketball) throw new Error("No NBA markets available.");

        // Extract only Moneyline markets
        const nbaMarkets = data.Basketball[4]; // LeagueId 4 = NBA
        const moneylineMarkets = nbaMarkets.filter(market => market.typeId === 0); // 0 = Moneyline

        if (moneylineMarkets.length === 0) throw new Error("No Moneyline markets found.");

        // Pick a random market
        const randomMarket = moneylineMarkets[Math.floor(Math.random() * moneylineMarkets.length)];

        console.log("Randomly selected market:", randomMarket);

        return {
            gameId: randomMarket.gameId,
            homeTeam: randomMarket.homeTeam || "Home Team",
            awayTeam: randomMarket.awayTeam || "Away Team"
        };
    } catch (error) {
        console.error("Error fetching NBA market:", error);
        return null;
    }
}
