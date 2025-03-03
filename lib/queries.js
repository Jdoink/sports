export async function fetchNBAMarket() {
    try {
        const response = await fetch(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&league=NBA&size=1"
        );
        if (!response.ok) throw new Error("Failed to fetch NBA market");

        const data = await response.json();
        
        // Ensure there's at least one valid market
        if (!data || data.length === 0) {
            throw new Error("No NBA markets found");
        }

        return data[0]; // Return the first NBA market
    } catch (error) {
        console.error("Error fetching NBA market:", error);
        return null;
    }
}
