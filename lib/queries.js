import { ethers } from "ethers";
import SPORTS_AMMV2_ABI from "./sportsAMMV2ContractAbi";
import { SPORTS_AMM_V2_CONTRACT_ADDRESS } from "./contracts";
import axios from "axios";

// **Fetch only NBA markets**
const API_BASE_URL = "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=nba&status=open&ungroup=true";

/**
 * Fetches all available NBA betting markets from the Overtime API.
 * Ensures that we are only pulling data for NBA games that are open.
 * @returns {Promise<Array>} - Returns an array of NBA market objects.
 */
export async function getMarkets() {
    try {
        console.log("Fetching NBA markets from Overtime API...");
        const response = await axios.get(API_BASE_URL);

        if (!response.data || response.data.length === 0) {
            console.warn("No active NBA markets found.");
            return [];
        }

        console.log("NBA Markets fetched:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching NBA markets:", error);
        return [];
    }
}

/**
 * Retrieves the top valid NBA market from the fetched markets.
 * Ensures that the selected market has valid odds and a valid game ID.
 * @returns {Promise<Object|null>} - Returns the selected NBA market or null if none are available.
 */
export async function getTopMarket() {
    try {
        const markets = await getMarkets();
        if (markets.length === 0) {
            console.warn("No active NBA markets found.");
            return null;
        }

        // Find the first market with valid odds and game ID
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
 * Fetches a quote for a trade using the Overtime V2 API.
 * This is necessary before placing a bet, as the trade function requires a quote.
 * @param {number} buyInAmount - The amount of USDC or collateral to bet.
 * @param {Array} tradeData - The trade data structure required by the AMM.
 * @returns {Promise<Object|null>} - Returns the quote data or null if the request fails.
 */
export async function getQuote(buyInAmount, tradeData) {
    try {
        console.log("Fetching trade quote from API...");

        const response = await axios.post(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/quote",
            {
                buyInAmount: buyInAmount,
                tradeData: tradeData
            }
        );

        if (!response.data || !response.data.quoteData) {
            console.warn("Invalid quote response from API.");
            return null;
        }

        console.log("Quote Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching quote:", error);
        return null;
    }
}
