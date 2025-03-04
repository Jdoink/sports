import { ethers } from "ethers";
import SPORTS_AMMV2_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

// API Endpoint from documentation
const API_BASE_URL = "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=NBA&status=open&ungroup=true";

export async function getMarkets() {
    try {
        console.log("Fetching NBA markets from Overtime API...");
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error("No active NBA markets found.");
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

        // Sort by highest liquidity (if available)
        const sortedMarkets = markets.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
        console.log("Selected Top Market:", sortedMarkets[0]);
        return sortedMarkets[0];
    } catch (error) {
        console.error("Error fetching top market:", error);
        return null;
    }
}
