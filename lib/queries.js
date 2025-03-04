import { ethers } from "ethers";
import SPORTS_AMM_V2_CONTRACT_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

export async function getMarkets(provider) {
    try {
        if (!provider) {
            console.warn("No provider available yet, waiting...");
            return [];
        }

        const contract = new ethers.Contract(
            SPORTS_AMM_V2_CONTRACT_ADDRESS,
            SPORTS_AMM_V2_CONTRACT_ABI,
            provider
        );

        console.log("Fetching available markets...");
        const markets = await contract.getAvailableMarkets();

        console.log("Raw Market Data:", markets);

        if (!markets || markets.length === 0) {
            console.warn("No available markets found. Retrying...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return [];
        }

        return markets;
    } catch (error) {
        console.error("Error fetching markets:", error);
        return [];
    }
}

export async function getTopLiquidityMarket(provider) {
    try {
        const markets = await getMarkets(provider);

        if (!markets || markets.length === 0) {
            console.warn("No markets available.");
            return null;
        }

        // Sort markets by highest liquidity
        const sortedMarkets = markets.sort((a, b) => Number(b.liquidity) - Number(a.liquidity));

        const topMarket = sortedMarkets[0];
        console.log("Selected Highest Liquidity Market:", topMarket);
        return topMarket;
    } catch (error) {
        console.error("Error fetching top liquidity market:", error);
        return null;
    }
}
