import { ethers } from "ethers";
import SPORTS_AMM_V2_CONTRACT_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

const API_BASE_URL = "https://api.overtimemarketsv2.xyz"; // Overtime API

export async function getMarkets() {
    try {
        const response = await fetch(`${API_BASE_URL}/markets`);
        if (!response.ok) throw new Error("Failed to fetch markets.");

        const markets = await response.json();

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
            throw new Error("No markets available.");
        }

        // Instead of picking a random market, select the **highest liquidity market**
        const sortedMarkets = markets.sort((a, b) => b.liquidity - a.liquidity);
        return sortedMarkets[0];
    } catch (error) {
        console.error("Error fetching random market:", error);
        return null;
    }
}
