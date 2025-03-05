import axios from "axios";

/**
 * Correct API Base URL for Overtime V2 Markets
 * Fetches only **Basketball** markets as specified by the API documentation.
 */
const API_BASE_URL =
    "https://overtimemarketsv2.xyz/overtime-v2/networks/10/markets?sport=basketball&status=open&ungroup=true";

/**
 * Fetches all available **Basketball** betting markets from Overtime V2 API.
 * @returns {Promise<Array>} - Returns an array of **basketball market objects**.
 */
export async function getMarkets() {
    try {
        console.log("Fetching Basketball markets from Overtime API...");
        const response = await axios.get(API_BASE_URL);

        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
            console.warn("No active Basketball markets found.");
            return [];
        }

        console.log("Basketball Markets fetched:", response.data.length);
        return response.data;
    } catch (error) {
        console.error("Error fetching Basketball markets:", error.message);
        return [];
    }
}

/**
 * Retrieves the **top valid market** from the list of fetched Basketball markets.
 * Ensures the market has:
 * - A **valid game ID**
 * - **At least one valid odds entry**
 * @returns {Promise<Object|null>} - Returns the **selected market object** or `null` if none are available.
 */
export async function getTopMarket() {
    try {
        const markets = await getMarkets();
        if (!Array.isArray(markets) || markets.length === 0) {
            console.warn("No active Basketball markets found.");
            return null;
        }

        // Find the first market with a valid game ID and odds
        const validMarket = markets.find(
            (market) =>
                market.gameId &&
                Array.isArray(market.odds) &&
                market.odds.length > 0
        );

        if (!validMarket) {
            console.warn("No valid Basketball market found.");
            return null;
        }

        console.log("Selected Basketball Market:", validMarket);
        return validMarket;
    } catch (error) {
        console.error("Error fetching top Basketball market:", error.message);
        return null;
    }
}

/**
 * Fetches a **trade quote** from the Overtime V2 API before placing a bet.
 * This ensures we have the correct payout expectations before executing the trade.
 * @param {number} buyInAmount - The amount of **USDC** or **collateral** to bet.
 * @param {Array} tradeData - The trade data structure required by the AMM contract.
 * @returns {Promise<Object|null>} - Returns the **quote data** or `null` if the request fails.
 */
export async function getQuote(buyInAmount, tradeData) {
    try {
        console.log("Fetching trade quote from API...");

        const response = await axios.post(
            "https://overtimemarketsv2.xyz/overtime-v2/networks/10/quote",
            {
                buyInAmount: buyInAmount,
                tradeData: tradeData,
            }
        );

        if (!response.data || !response.data.quoteData) {
            console.warn("Invalid quote response from API.");
            return null;
        }

        console.log("Quote Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching quote:", error.message);
        return null;
    }
}
