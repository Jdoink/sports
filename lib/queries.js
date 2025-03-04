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

        console.log("Fetching available markets...");
        const markets = await contract.getAvailableMarkets();

        console.log("Raw Market Data:", markets);

        if (!markets || markets.length === 0) {
            console.warn("No available markets found.");
            return [];
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

        if (!markets || markets.length === 0) {
            console.warn("No markets available.");
            return null;
        }

        const randomIndex = Math.floor(Math.random() * markets.length);
        const selectedMarket = markets[randomIndex];

        console.log("Selected Random Market:", selectedMarket);
        return selectedMarket;
    } catch (error) {
        console.error("Error fetching random market:", error);
        return null;
    }
}
