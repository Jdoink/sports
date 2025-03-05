import axios from "axios";

const API_URL = "https://overtimemarketsv2.xyz";
const NETWORK_ID = 10;

export async function getNBAQuote(market, betAmount) {
  try {
    const response = await axios.post(`${API_URL}/overtime-v2/networks/${NETWORK_ID}/quote`, {
      buyInAmount: betAmount,
      tradeData: [
        {
          gameId: market.gameId,
          sportId: market.sportId,
          typeId: market.typeId,
          maturity: market.maturity,
          status: market.status,
          line: market.line,
        },
      ],
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
}
