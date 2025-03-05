import { ethers } from "ethers";
import SPORTS_AMMV2_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

// Correct API endpoint (uses "basketball" instead of "NBA")
const API_BASE_URL = "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=basketball&status=open&ungroup=true";

export async function getMarkets() {
    try {
        console.log("Fetching basketball markets from Overtime API...");
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            console.warn("No active basketball markets found.");
            return [];
        }

        console.log("Markets fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching markets:", error);
        return [];
    }
}

export async function getTopMarket() {
    try {
        const markets = await getMarkets();
        if (markets.length === 0) {
            console.warn("No active markets found.");
            return null;
        }

        // Find the first market with valid odds and game ID
        const validMarket = markets.find(
            (market) => market.gameId && market.odds && market.odds.length > 0
        );

        if (!validMarket) {
            console.warn("No valid market found.");
            return null;
        }

        console.log("Selected Top Market:", validMarket);
        return validMarket;
    } catch (error) {
        console.error("Error fetching top market:", error);
        return null;
    }
}
