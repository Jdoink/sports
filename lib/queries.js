import { ethers } from "ethers";
import SPORTS_AMMV2_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

// API Endpoint
const API_BASE_URL = "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=Basketball&status=open&ungroup=true";

export async function getMarkets() {
    try {
        console.log("Fetching NBA markets from Overtime API...");

        const response = await fetch(API_BASE_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        // Check if the response is actually JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await response.text();
            throw new Error(`API did not return JSON. Response: ${textResponse}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No active NBA markets found.");
            return [];
        }

        console.log("Markets fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching markets:", error.message);
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

        // Sort by highest liquidity
        const sortedMarkets = markets.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
        const topMarket = sortedMarkets[0];

        console.log("Selected Top Market:", topMarket);

        return {
            gameId: topMarket.marketId || "",
            sportId: topMarket.sportId || "",
            typeId: topMarket.typeId || "",
            maturity: topMarket.maturity || "",
            status: topMarket.status || "",
            line: topMarket.line || "",
            odds: topMarket.odds || "",
            homeTeam: topMarket.homeTeam || "Home Team",
            awayTeam: topMarket.awayTeam || "Away Team"
        };
    } catch (error) {
        console.error("Error fetching top market:", error.message);
        return null;
    }
}
