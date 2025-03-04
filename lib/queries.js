import { ethers } from "ethers";
import SPORTS_AMM_V2_CONTRACT_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

export async function getMarkets(provider) {
    try {
        const contract = new ethers.Contract(
            SPORTS_AMM_V2_CONTRACT_ADDRESS,
            SPORTS_AMM_V2_CONTRACT_ABI,
            provider
        );

        // Fetch all available markets
        const markets = await contract.getAvailableMarkets();

        if (!markets || markets.length === 0) {
            throw new Error("No available markets found.");
        }

        return markets;
    } catch (error) {
        console.error("Error fetching markets:", error);
        return [];
    }
}

export async function getRandomMarket(provider) {
    try {
        const markets = await getMarkets(provider);

        if (markets.length === 0) {
            throw new Error("No markets available.");
        }

        const randomIndex = Math.floor(Math.random() * markets.length);
        return markets[randomIndex];
    } catch (error) {
        console.error("Error fetching random market:", error);
        return null;
    }
}
