import axios from "axios";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";

const API_BASE_URL = "https://overtimemarketsv2.xyz/overtime-v2/networks/10";

/**
 * Fetches all active basketball markets from the Overtime API.
 * Ensures only NBA games are considered.
 */
export async function getMarkets() {
    try {
        console.log("Fetching NBA markets from Overtime API...");
        
        const response = await axios.get(`${API_BASE_URL}/markets?sport=basketball&status=open&ungroup=true`);

        if (!response.data || response.data.length === 0) {
            console.warn("No active NBA markets found.");
            return [];
        }

        // Filtering only NBA games (assuming `leagueId` or `subLeagueId` can be used to filter for NBA)
        const nbaMarkets = response.data.filter(market => market.leagueId === 4 || market.subLeagueId === 4);

        console.log(`Basketball Markets fetched: ${nbaMarkets.length}`);

        return nbaMarkets;
    } catch (error) {
        console.error("Error fetching NBA markets:", error);
        return [];
    }
}

/**
 * Fetches the top available NBA market.
 */
export async function getTopMarket() {
    try {
        const markets = await getMarkets();
        if (markets.length === 0) {
            console.warn("No active NBA markets found.");
            return null;
        }

        // Select the first valid market
        const validMarket = markets.find(
            (market) => market.gameId && market.odds && market.odds.length > 0
        );

        if (!validMarket) {
            console.warn("No valid NBA market found.");
            return null;
        }

        console.log("Selected NBA Market:", validMarket);
        return validMarket;
    } catch (error) {
        console.error("Error fetching top NBA market:", error);
        return null;
    }
}

/**
 * Fetches a trade quote for a given market.
 * @param {Object} tradeData - The trade data containing game ID and odds.
 * @param {string} betAmount - The bet amount in USDC.
 */
export async function getTradeQuote(tradeData, betAmount) {
    try {
        console.log("Fetching trade quote from API...");

        const requestBody = {
            buyInAmount: betAmount,
            tradeData: [tradeData],
        };

        console.log("Quote Request Data:", requestBody);

        const response = await axios.post(`${API_BASE_URL}/quote`, requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.data || !response.data.quoteData) {
            console.error("Invalid response from quote API:", response);
            return null;
        }

        console.log("Quote Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching trade quote:", error);
        return null;
    }
}
