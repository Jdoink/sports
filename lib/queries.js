import { ethers } from "ethers";
import SPORTS_AMM_V2_CONTRACT_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

// API Endpoint for Overtime V2 Markets
const API_BASE_URL = "https://overtimemarketsv2.xyz/api"; // Update if necessary

export async function getMarkets() {
    try {
        console.log("Fetching markets from API...");
        const response = await fetch(`${API_BASE_URL}/markets`);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);

        const markets = await response.json();
        console.log("Markets received:", markets);

        if (!markets || markets.length === 0) {
            throw new Error("No available markets found.");
        }

        return markets;
    } catch (error) {
        console.error("Error fetching markets:", error);
        return [];
    }
}

export async function getRandomMarket() {
    try {
        const markets = await getMarkets();

        if (!markets.length) {
            console.warn("No markets found, using fallback market.");
            return {
                gameId: "0x123456789abcdef",
                homeTeam: "Lakers",
                awayTeam: "Warriors",
                sportId: 4,
                typeId: 1,
                maturity: Math.floor(Date.now() / 1000) + 86400, // 24 hours in future
                status: "open",
                line: "1.5",
                odds: [2.0, 1.8],
            };
        }

        // Pick the highest liquidity market
        const sortedMarkets = markets.sort((a, b) => b.liquidity - a.liquidity);
        return sortedMarkets[0];
    } catch (error) {
        console.error("Error fetching random market:", error);
        return null;
    }
}
