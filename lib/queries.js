import axios from "axios";

const API_URL = "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets";

// Function to fetch NBA markets from the API
export const fetchNBAMarkets = async () => {
  try {
    console.log("Fetching NBA markets from Overtime API...");

    const response = await axios.get(`${API_URL}?leagueId=4&ungroup=true`); // NBA is leagueId 4
    const markets = response.data;

    if (!markets || markets.length === 0) {
      console.error("No valid NBA markets found.");
      return null;
    }

    console.log(`NBA Markets fetched: ${markets.length}`);
    return markets;
  } catch (error) {
    console.error("Error fetching NBA markets:", error);
    return null;
  }
};

// Function to find the best NBA market for betting
export const findValidNBAMarket = async () => {
  const markets = await fetchNBAMarkets();
  if (!markets) return null;

  // Find a valid game with open status and valid odds
  const selectedMarket = markets.find((game) => game.status === "open" && game.odds && game.odds.length > 0);

  if (!selectedMarket) {
    console.error("No valid NBA games available for betting.");
    return null;
  }

  console.log("Selected NBA Market:", selectedMarket);
  return selectedMarket;
};
