import { ethers } from "ethers";
import SPORTS_AMM_V2_CONTRACT_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

const NETWORK = "optimism"; // Replace with your target network
const API_BASE_URL = `https://api.overtimemarkets.xyz/overtime/networks/${NETWORK}/markets`;

export async function getMarkets(provider) {
    try {
        console.log("Fetching markets from API...");
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error("No available markets found.");
        }

        return data;
    } catch (error) {
        console.error("Error fetching markets:", error);
        return [];
    }
}

export async function getRandomMarket(provider) {
    try {
        const markets = await getMarkets(provider);

        if (markets.length === 0) {
            console.warn("No markets found, using fallback market.");
            return {
                gameId: "0x30783132333334353637383936316263646566",
                homeTeam: "Lakers",
                awayTeam: "Warriors",
                sportId: 4,
                typeId: 1,
                maturity: 1741214069,
                status: "open",
                line: "1.5",
                odds: [2, 1.8],
            };
        }

        // Select the most popular market by highest liquidity
        const sortedMarkets = markets.sort((a, b) => b.liquidity - a.liquidity);
        return sortedMarkets[0];
    } catch (error) {
        console.error("Error fetching random market:", error);
        return null;
    }
}
