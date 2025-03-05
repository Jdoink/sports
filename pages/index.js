import axios from "axios";
import { ethers } from "ethers";
import sportsAMMV2ContractAbi from "./sportsAMMV2ContractAbi.js"; // Ensure this file exists

const API_URL = "https://overtimemarketsv2.xyz/overtime-v2/networks/10";
const SPORTS_AMM_V2_CONTRACT_ADDRESS = "0xFb4e4811C7A811E098A556bD79B64c20b479E431"; // Ensure this is correct

const COLLATERAL = "USDC"; // Betting with USDC

// ✅ Fetch NBA markets
const fetchNBAMarkets = async () => {
  try {
    console.log("Fetching NBA markets from Overtime API...");
    const response = await axios.get(`${API_URL}/markets?leagueId=4&ungroup=true`);
    const markets = response.data;

    if (!markets || markets.length === 0) {
      console.error("No valid NBA markets found.");
      return null;
    }

    console.log(`NBA Markets fetched: ${markets.length}`);
    return markets;
  } catch (error) {
    console.error("Error fetching NBA markets:", error);
    return null;
  }
};

// ✅ Select a valid NBA game
const findValidNBAMarket = async () => {
  const markets = await fetchNBAMarkets();
  if (!markets) return null;

  const selectedMarket = markets.find((game) => game.status === "open" && game.odds && game.odds.length > 0);
  if (!selectedMarket) {
    console.error("No valid NBA games available for betting.");
    return null;
  }

  console.log("Selected NBA Market:", selectedMarket);
  return selectedMarket;
};

// ✅ Fetch Quote Data for a Selected Game
const fetchQuoteData = async (selectedMarket, position, buyInAmount) => {
  try {
    console.log("Fetching trade quote from API...");

    const tradeData = [{
      gameId: selectedMarket.gameId,
      sportId: selectedMarket.sportId, 
      typeId: selectedMarket.typeId,
      maturity: selectedMarket.maturity,
      status: selectedMarket.status,
      line: selectedMarket.line,
      playerId: selectedMarket.playerId || 0,
      position: position,
      combinedPositions: selectedMarket.combinedPositions || [],
    }];

    console.log("Trade Data:", tradeData);

    const response = await axios.post(`${API_URL}/quote`, {
      buyInAmount: buyInAmount,
      tradeData: tradeData,
      collateral: COLLATERAL
    });

    console.log("Quote Data Received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching quote data:", error.response?.data || error.message);
    throw new Error("Failed to retrieve quote data.");
  }
};

// ✅ Place a Bet
const placeBet = async (wallet, selectedMarket, position, buyInAmount) => {
  try {
    const provider = new ethers.providers.InfuraProvider("optimism", process.env.INFURA);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const sportsAMM = new ethers.Contract(SPORTS_AMM_V2_CONTRACT_ADDRESS, sportsAMMV2ContractAbi, signer);

    console.log("Signer detected, proceeding with bet...");

    const quoteData = await fetchQuoteData(selectedMarket, position, buyInAmount);
    if (!quoteData || !quoteData.quoteData || !quoteData.quoteData.totalQuote) {
      throw new Error("Invalid quote response. Aborting bet.");
    }

    console.log("Quote Data Valid:", quoteData);

    const parsedTotalQuote = ethers.utils.parseEther(quoteData.quoteData.totalQuote.normalizedImplied.toString());
    const parsedBuyInAmount = ethers.utils.parseUnits(buyInAmount.toString(), 6); // USDC has 6 decimals

    const tx = await sportsAMM.trade(
      [selectedMarket],
      parsedBuyInAmount,
      parsedTotalQuote,
      ethers.utils.parseEther("0.02"), // 2% slippage
      "0x0000000000000000000000000000000000000000", // No referral
      COLLATERAL,
      false
    );

    const txResult = await tx.wait();
    console.log(`Successfully placed bet. Transaction hash: ${txResult.transactionHash}`);
    return txResult.transactionHash;
  } catch (error) {
    console.error("Error placing bet:", error);
    throw new Error("Bet placement failed.");
  }
};

// ✅ UI Event Handling (ONLY IF YOU HAVE FRONTEND)
document.getElementById("betButton").addEventListener("click", async () => {
  try {
    console.log("Starting bet function...");

    const selectedMarket = await findValidNBAMarket();
    if (!selectedMarket) {
      alert("No valid NBA games available for betting.");
      return;
    }

    console.log("Selected NBA Market:", selectedMarket);

    const buyInAmount = parseFloat(document.getElementById("betAmount").value);
    if (!buyInAmount || buyInAmount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    console.log("Proceeding with bet for amount:", buyInAmount);

    // Assuming position = 1 for Home Team, 2 for Away Team
    const position = confirm(`Bet on ${selectedMarket.homeTeam}?`) ? 1 : 2;

    const wallet = "0xYOUR_WALLET_ADDRESS"; // Replace with actual connected wallet

    const txHash = await placeBet(wallet, selectedMarket, position, buyInAmount);
    alert(`Bet placed successfully! TX Hash: ${txHash}`);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while placing the bet. Check the console for details.");
  }
});
